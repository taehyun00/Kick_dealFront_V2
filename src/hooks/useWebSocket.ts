import { useEffect, useRef, useState, useCallback } from 'react'

interface Message {
  id: number
  senderId: number
  senderName: string
  content: string
  createdAt: string
  isRead: boolean
}

interface WebSocketMessage {
  type: 'MESSAGE' | 'READ' | 'TYPING' | 'CONNECT' | 'DISCONNECT'
  data: any
}

export const useWebSocket = (roomId: string | string[]) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<NodeJS.Timeout>()
  const heartbeatInterval = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      // WebSocket 연결
      ws.current = new WebSocket(
        `wss://api.leegunwoo.com/ws-chat`
      )

      ws.current.onopen = () => {
        console.log('✅ WebSocket 연결 성공')
        setIsConnected(true)

        // Heartbeat (30초마다 ping)
        heartbeatInterval.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'PING' }))
          }
        }, 30000)
      }

      ws.current.onmessage = (event) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(event.data)
          
          switch (wsMessage.type) {
            case 'MESSAGE':
              // 새 메시지 수신
              setMessages((prev) => [...prev, wsMessage.data])
              break
              
            case 'READ':
              // 메시지 읽음 처리
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === wsMessage.data.messageId
                    ? { ...msg, isRead: true }
                    : msg
                )
              )
              break
              
            case 'TYPING':
              // 상대방 타이핑 중
              setIsTyping(wsMessage.data.isTyping)
              break
              
            case 'CONNECT':
              console.log('상대방 접속:', wsMessage.data)
              break
              
            case 'DISCONNECT':
              console.log('상대방 퇴장:', wsMessage.data)
              break
          }
        } catch (error) {
          console.error('메시지 파싱 에러:', error)
        }
      }

      ws.current.onerror = (error) => {
        console.error('❌ WebSocket 에러:', error)
      }

      ws.current.onclose = (event) => {
        console.log('🔌 WebSocket 연결 종료:', event.code, event.reason)
        setIsConnected(false)

        // Heartbeat 정리
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current)
        }

        // 비정상 종료시 재연결 (5초 후)
        if (event.code !== 1000) {
          reconnectTimeout.current = setTimeout(() => {
            console.log('🔄 재연결 시도...')
            connect()
          }, 5000)
        }
      }
    } catch (error) {
      console.error('WebSocket 연결 실패:', error)
    }
  }, [roomId])

  useEffect(() => {
    connect()

    return () => {
      // 정리
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current)
      }
      if (ws.current) {
        ws.current.close(1000, 'Component unmounted')
      }
    }
  }, [connect])

  const sendMessage = useCallback((content: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: 'MESSAGE',
          data: { content },
        })
      )
      return true
    }
    return false
  }, [])

  const sendTyping = useCallback((isTyping: boolean) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: 'TYPING',
          data: { isTyping },
        })
      )
    }
  }, [])

  const markAsRead = useCallback((messageId: number) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: 'READ',
          data: { messageId },
        })
      )
    }
  }, [])

  return {
    messages,
    setMessages,
    isConnected,
    isTyping,
    sendMessage,
    sendTyping,
    markAsRead,
  }
}
