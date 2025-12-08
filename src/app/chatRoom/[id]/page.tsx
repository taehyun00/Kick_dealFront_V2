'use client'

import React, { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { useWebSocket } from '@/hooks/useWebsoket'

const MAIN_COLOR = '#ff4757'

interface ChatRoomInfo {
  id: number
  buyer: string
  name: string
  productId: number
  seller: string
  price: number
}

const ChatRoom: React.FC = () => {
  const [newMessage, setNewMessage] = useState('')
  const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTypingMine, setIsTypingMine] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const params = useParams()
  const roomId = params.id as string
  const router = useRouter()

  const {
    messages,
    setMessages,
    connectionState,
    isTyping,
    connect,
    sendMessage: wsSendMessage,
    sendTyping,
  } = useWebSocket(roomId)

  const isConnected = connectionState === 'connected'

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const token = localStorage.getItem('access-token')
        if (!token) {
          alert('로그인이 필요합니다.')
          router.push('/login')
          return
        }

        const roomRes = await axios.get<ChatRoomInfo>(
          `https://api.leegunwoo.com/chatrooms/${roomId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (cancelled) return
        setRoomInfo(roomRes.data)

        const userRes = await axios.get('https://api.leegunwoo.com/users/info', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (cancelled) return
        setCurrentUserId(userRes.data.username)

        try {
          await connect()
          if (cancelled) return
        } catch (e) {
          console.error('WebSocket 연결 실패:', e)
        }

        await fetchInitialMessages()
      } catch (error) {
        console.error('채팅방 초기화 실패:', error)
        if (!cancelled) {
          alert('채팅방 정보를 불러올 수 없습니다.')
          router.back()
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [roomId, connect, router])

  const fetchInitialMessages = async () => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setMessages([])
      return
    }

    try {
      const response = await axios.get(
        `https://api.leegunwoo.com/${roomId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (Array.isArray(response.data)) {
        setMessages(response.data)
      } else if (response.data.messages) {
        setMessages(response.data.messages)
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error('메시지 불러오기 실패:', error)
      setMessages([])
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const success = await wsSendMessage(newMessage)
      if (success) {
        setNewMessage('')
        sendTyping(false)
        setIsTypingMine(false)

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = null
        }
      } else {
        alert('메시지 전송 실패. 연결을 확인해주세요.')
      }
    } catch (e) {
      console.error('메시지 전송 중 에러:', e)
      alert('메시지 전송 중 오류가 발생했습니다.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewMessage(value)

    const mineNow = !!value.trim()
    setIsTypingMine(mineNow)

    if (mineNow) {
      sendTyping(true)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(false)
        setIsTypingMine(false)
      }, 3000)
    } else {
      sendTyping(false)
      setIsTypingMine(false)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    }
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

  if (loading) {
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    )
  }

  if (!roomInfo) {
    return (
      <Container>
        <LoadingText>채팅방 정보를 불러올 수 없습니다.</LoadingText>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>←</BackButton>
        <HeaderInfo>
          <UserNameRow>
            <UserName>{roomInfo.seller}</UserName>
            <ConnectionStatus isConnected={isConnected}>
              {connectionState === 'connecting'
                ? '○ 연결중'
                : isConnected
                ? '● 연결됨'
                : '○ 끊김'}
            </ConnectionStatus>
          </UserNameRow>
          <ProductName onClick={() => router.push(`/product/${roomInfo.productId}`)}>
            {roomInfo.name}
          </ProductName>
        </HeaderInfo>
      </Header>

      <ProductCard onClick={() => router.push(`/product/${roomInfo.productId}`)}>
        <ProductCardInfo>
          <ProductCardName>{roomInfo.name}</ProductCardName>
          <ProductCardPrice>{roomInfo.price.toLocaleString()}원</ProductCardPrice>
        </ProductCardInfo>
      </ProductCard>

      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyMessage>메시지가 없습니다. 첫 메시지를 보내보세요!</EmptyMessage>
        ) : (
          messages.map((message, index) => {
            const showDate =
              index === 0 ||
              new Date(messages[index - 1].timestamp).toDateString() !==
                new Date(message.timestamp).toDateString()

            const senderUsername =
              message.sender?.username || message.senderName || '알 수 없음'
            const isMine = senderUsername === currentUserId

            return (
              <React.Fragment key={message.id}>
                {showDate && <DateDivider>{formatDate(message.timestamp)}</DateDivider>}
                <MessageWrapper isMine={isMine}>
                  {!isMine && (
                    <SenderName>
                      {message.sender?.username ?? message.senderName ?? '알 수 없음'}
                    </SenderName>
                  )}
                  <MessageBubble isMine={isMine}>
                    <MessageContent isMine={isMine}>{message.content}</MessageContent>
                    <MessageInfo>
                      <MessageTime>{formatTime(message.timestamp)}</MessageTime>
                    </MessageInfo>
                  </MessageBubble>
                </MessageWrapper>
              </React.Fragment>
            )
          })
        )}
        <TypeingBox isMine={isTypingMine} >
        {isTyping && (
          <TypingIndicator>
            <TypingDot delay={0} />
            <TypingDot delay={0.2} />
            <TypingDot delay={0.4} />
          </TypingIndicator>
        )}
        </TypeingBox>
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <MessageInput
          placeholder={
            connectionState === 'connecting'
              ? '연결 중...'
              : isConnected
              ? '메시지를 입력하세요'
              : '연결이 끊어졌습니다'
          }
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
        />
        <SendButton
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || !isConnected}
        >
          {connectionState === 'connecting'
            ? '연결중'
            : isConnected
            ? '전송'
            : '재연결 필요'}
        </SendButton>
      </InputContainer>
    </Container>
  )
}

export default ChatRoom

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-size: 14px;
`

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffffff;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 20px;
  z-index: 10;
  margin-top: 120px;
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

const TypeingBox = styled.div<{ isMine: boolean }>`
  width : 100%;
  display : flex;
  justify-content: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};

`

const TypingDot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #999;
  animation: typing 1.4s infinite;
  animation-delay: ${({ delay }) => delay}s;

  @keyframes typing {
    0%,
    60%,
    100% {
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
