'use client'

import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const MAIN_COLOR = '#ff4757'

interface ChatRoom {
  id: number
  productId: number
  productName: string
  productImage: string
  otherUserName: string
  otherUserId: number
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

const ChatList: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchChatRooms()
  }, [])

  const fetchChatRooms = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    try {
      const response = await axios.get<ChatRoom[]>(
        'https://api.leegunwoo.com/chatrooms',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setChatRooms(response.data)
    } catch (error) {
      console.error('채팅 목록 불러오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>채팅</Title>
      </Header>

      {chatRooms.length === 0 ? (
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <EmptyText>아직 채팅 내역이 없습니다</EmptyText>
        </EmptyState>
      ) : (
        <ChatRoomList>
          {chatRooms.map((room) => (
            <ChatRoomItem
              key={room.id}
              onClick={() => router.push(`/chat/${room.id}`)}
            >
              <ProductImage src={room.productImage} alt={room.productName} />
              <ChatInfo>
                <TopRow>
                  <UserName>{room.otherUserName}</UserName>
                  <TimeStamp>{formatTime(room.lastMessageTime)}</TimeStamp>
                </TopRow>
                <ProductName>{room.productName}</ProductName>
                <LastMessage>{room.lastMessage}</LastMessage>
              </ChatInfo>
              {room.unreadCount > 0 && (
                <UnreadBadge>{room.unreadCount}</UnreadBadge>
              )}
            </ChatRoomItem>
          ))}
        </ChatRoomList>
      )}
    </Container>
  )
}

export default ChatList

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  padding: 100px 20px 20px;
`

const Header = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
`

const ChatRoomList = styled.div`
  display: flex;
  flex-direction: column;
`

const ChatRoomItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: #f9f9f9;
  }
`

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 16px;
  flex-shrink: 0;
`

const ChatInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const UserName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`

const TimeStamp = styled.span`
  font-size: 12px;
  color: #999;
`

const ProductName = styled.span`
  font-size: 13px;
  color: #666;
`

const LastMessage = styled.span`
  font-size: 14px;
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const UnreadBadge = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${MAIN_COLOR};
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: 18px;
  color: #666;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`

const EmptyIcon = styled.div`
  font-size: 64px;
`

const EmptyText = styled.p`
  font-size: 16px;
  color: #999;
`
