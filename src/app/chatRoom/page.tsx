'use client'

import React, { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { useWebSocket } from '@/hooks/useWebSocket'

const MAIN_COLOR = '#ff4757'

interface ChatRoomInfo {
  id: number
  productId: number
  productName: string
  productPrice: number
  productImage: string
  otherUserId: number
  otherUserName: string
  sellerId: number
}

const ChatRoom: React.FC = () => {
  const [newMessage, setNewMessage] = useState('')
  const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const params = useParams()
  const roomId = params.id as string
  const router = useRouter()

  // WebSocket Hook 사용
  const {
    messages,
    setMessages,
    isConnected,
    isTyping,
    sendMessage: wsSendMessage,
    sendTyping,
    markAsRead,
  } = useWebSocket(roomId)

  useEffect(() => {
    fetchChatRoom()
    fetchInitialMessages()
  }, [roomId])

  useEffect(() => {
    scrollToBottom()
    
    // 새 메시지가 도착하면 읽음 처리
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.senderId !== currentUserId && !lastMessage.isRead) {
        markAsRead(lastMessage.id)
      }
    }
  }, [messages])

  const fetchChatRoom = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    try {
      const response = await axios.get<ChatRoomInfo>(
        `https://api.leegunwoo.com/chats/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setRoomInfo(response.data)
      
      // 현재 사용자 ID 가져오기
      const userResponse = await axios.get(
        'https://api.leegunwoo.com/users/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setCurrentUserId(userResponse.data.id)
    } catch (error) {
      console.error('채팅방 정보 불러오기 실패:', error)
    }
  }

  const fetchInitialMessages = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await axios.get(
        `https://api.leegunwoo.com/chats/${roomId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setMessages(response.data)
    } catch (error) {
      console.error('메시지 불러오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const success = wsSendMessage(newMessage)
    
    if (success) {
      setNewMessage('')
      sendTyping(false)
    } else {
      alert('메시지 전송 실패. 연결을 확인해주세요.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    
    // 타이핑 중 표시
    sendTyping(true)
    
    // 3초 후 타이핑 중 해제
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false)
    }, 3000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    
    if (date.toDateString() === today.toDateString()) {
      return '오늘'
    }
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return '어제'
    }
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading || !roomInfo) {
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>←</BackButton>
        <HeaderInfo>
          <UserNameRow>
            <UserName>{roomInfo.otherUserName}</UserName>
            <ConnectionStatus isConnected={isConnected}>
              {isConnected ? '●' : '○'}
            </ConnectionStatus>
          </UserNameRow>
          <ProductName onClick={() => router.push(`/product/${roomInfo.productId}`)}>
            {roomInfo.productName}
          </ProductName>
        </HeaderInfo>
      </Header>

      <ProductCard onClick={() => router.push(`/product/${roomInfo.productId}`)}>
        <ProductCardImage src={roomInfo.productImage} alt={roomInfo.productName} />
        <ProductCardInfo>
          <ProductCardName>{roomInfo.productName}</ProductCardName>
          <ProductCardPrice>{roomInfo.productPrice.toLocaleString()}원</ProductCardPrice>
        </ProductCardInfo>
      </ProductCard>

      <MessagesContainer>
        {messages.map((message, index) => {
          const showDate =
            index === 0 ||
            new Date(messages[index - 1].createdAt).toDateString() !==
              new Date(message.createdAt).toDateString()

          const isMine = message.senderId === currentUserId

          return (
            <React.Fragment key={message.id}>
              {showDate && <DateDivider>{formatDate(message.createdAt)}</DateDivider>}
              <MessageWrapper isMine={isMine}>
                {!isMine && <SenderName>{message.senderName}</SenderName>}
                <MessageBubble isMine={isMine}>
                  <MessageContent isMine={isMine}>{message.content}</MessageContent>
                  <MessageInfo>
                    <MessageTime>{formatTime(message.createdAt)}</MessageTime>
                    {isMine && (
                      <ReadStatus isRead={message.isRead}>
                        {message.isRead ? '읽음' : '안읽음'}
                      </ReadStatus>
                    )}
                  </MessageInfo>
                </MessageBubble>
              </MessageWrapper>
            </React.Fragment>
          )
        })}
        
        {isTyping && (
          <TypingIndicator>
            <TypingDot delay={0} />
            <TypingDot delay={0.2} />
            <TypingDot delay={0.4} />
          </TypingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <MessageInput
          placeholder="메시지를 입력하세요"
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
        />
        <SendButton 
          onClick={handleSendMessage} 
          disabled={!newMessage.trim() || !isConnected}
        >
          {isConnected ? '전송' : '연결중...'}
        </SendButton>
      </InputContainer>
    </Container>
  )
}

export default ChatRoom

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
`

const BackButton = styled.button`
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-right: 12px;
  color: #333;
`

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`

const UserNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const UserName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`

const ConnectionStatus = styled.span<{ isConnected: boolean }>`
  font-size: 12px;
  color: ${({ isConnected }) => (isConnected ? '#4CAF50' : '#999')};
`

const ProductName = styled.span`
  font-size: 13px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

const ProductCard = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }
`

const ProductCardImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 12px;
`

const ProductCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ProductCardName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`

const ProductCardPrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${MAIN_COLOR};
`

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
`

const DateDivider = styled.div`
  text-align: center;
  color: #999;
  font-size: 12px;
  margin: 16px 0;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background-color: #ddd;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`

const MessageWrapper = styled.div<{ isMine: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  gap: 4px;
`

const SenderName = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: 8px;
`

const MessageBubble = styled.div<{ isMine: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 70%;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
`

const MessageContent = styled.div<{ isMine: boolean }>`
  background-color: ${({ isMine }) => (isMine ? MAIN_COLOR : '#fff')};
  color: ${({ isMine }) => (isMine ? '#fff' : '#333')};
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-end;
  margin-bottom: 4px;
`

const MessageTime = styled.span`
  font-size: 11px;
  color: #999;
  white-space: nowrap;
`

const ReadStatus = styled.span<{ isRead: boolean }>`
  font-size: 10px;
  color: ${({ isRead }) => (isRead ? '#4CAF50' : '#FF9800')};
  font-weight: 600;
`

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 18px;
  width: fit-content;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`

const TypingDot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #999;
  animation: typing 1.4s infinite;
  animation-delay: ${({ delay }) => delay}s;

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #eee;
  gap: 12px;
`

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${MAIN_COLOR};
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`

const SendButton = styled.button`
  padding: 12px 24px;
  background-color: ${MAIN_COLOR};
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 18px;
  color: #666;
`
