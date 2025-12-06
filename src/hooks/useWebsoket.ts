import { useCallback, useEffect, useRef, useState } from 'react'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'

export interface Message {
  id: number
  roomId: number
  senderId: number
  senderName: string
  content: string
  type: string
  timestamp: string
}

interface SendMessagePayload {
  content: string
}

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error'

export const useWebSocket = (rawRoomId: string | string[]) => {
  const roomId = Array.isArray(rawRoomId) ? rawRoomId[0] : rawRoomId

  const [messages, setMessages] = useState<Message[]>([])
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle')
  const [isTyping, setIsTyping] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  const stompClientRef = useRef<Client | null>(null)
  const subscriptionRef = useRef<StompSubscription | null>(null)

  // ❗ “연결 완료를 알려줄 Promise”를 ref로 관리
  const connectPromiseRef = useRef<Promise<void> | null>(null)
  const connectResolveRef = useRef<(() => void) | null>(null)
  const connectRejectRef = useRef<((reason?: any) => void) | null>(null)

  const createConnectPromise = () => {
    const p = new Promise<void>((resolve, reject) => {
      connectResolveRef.current = resolve
      connectRejectRef.current = reject
    })
    connectPromiseRef.current = p
    return p
  }

  const clearConnectPromise = () => {
    connectPromiseRef.current = null
    connectResolveRef.current = null
    connectRejectRef.current = null
  }

  /** 내부 정리 함수 */
  const cleanupClient = useCallback(async () => {
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe()
      } catch (e) {
        console.error('구독 해제 실패:', e)
      }
      subscriptionRef.current = null
    }

    if (stompClientRef.current) {
      const client = stompClientRef.current
      stompClientRef.current = null
      try {
        await client.deactivate()
      } catch (e) {
        console.error('STOMP 비활성화 실패:', e)
      }
    }

    clearConnectPromise()
    setConnectionState('idle')
  }, [])

  /** 블로그 글처럼: “연결 완료를 await할 수 있는 connect” */
  const connect = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setLastError('NO_TOKEN')
      setConnectionState('error')
      return Promise.reject(new Error('NO_TOKEN'))
    }

    // 이미 연결 완료된 상태면 그냥 resolve
    if (stompClientRef.current?.connected) {
      return Promise.resolve()
    }

    // 이미 연결 시도 중이면 그 Promise 재사용 (중복 connect 방지)
    if (connectPromiseRef.current) {
      return connectPromiseRef.current
    }

    setConnectionState('connecting')
    setLastError(null)

    // 기존 클라이언트 정리
    await cleanupClient()

    // 여기서부터 새 연결 시도
    const client = new Client({
      brokerURL: 'wss://api.leegunwoo.com/ws-chat',
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 0, // 여기선 자동 재연결은 잠시 끔 (직접 제어하기 쉽게)

      debug: (str) => {
        console.log('🔧 STOMP:', str)
      },

      onConnect: (frame) => {
        console.log('✅ STOMP CONNECT 성공:', frame.headers)
        setConnectionState('connected')

        // 구독 설정
        const destination = `/topic/${roomId}`
        const subscription = client.subscribe(destination, (msg: IMessage) => {
          try {
            const parsed: Message = JSON.parse(msg.body)
            setMessages((prev) => {
              if (prev.some((m) => m.id === parsed.id)) return prev
              return [...prev, parsed]
            })
          } catch (e) {
            console.error('JSON 파싱 실패:', e)
          }
        })
        subscriptionRef.current = subscription

        // ✅ 여기서 “연결 완료” Promise resolve
        if (connectResolveRef.current) {
          connectResolveRef.current()
        }
        clearConnectPromise()
      },

      onStompError: (frame) => {
        console.error('❌ STOMP ERROR:', frame.headers, frame.body)
        setConnectionState('error')
        setLastError('STOMP_ERROR')
        if (connectRejectRef.current) {
          connectRejectRef.current(new Error('STOMP_ERROR'))
        }
        clearConnectPromise()
      },

      onWebSocketClose: (event) => {
        console.log('🔌 WebSocket Close:', event)
        setConnectionState('idle')
      },

      onWebSocketError: (event) => {
        console.error('❌ WebSocket Error:', event)
        setConnectionState('error')
        setLastError('WS_ERROR')
        if (connectRejectRef.current) {
          connectRejectRef.current(new Error('WS_ERROR'))
        }
        clearConnectPromise()
      },

      onDisconnect: () => {
        console.log('🔌 STOMP Disconnect')
        setConnectionState('idle')
      },
    })

    stompClientRef.current = client

    // 블로그 코드의 super.connect() + Promise 패턴과 동일한 지점
    const connectPromise = createConnectPromise()
    client.activate() // 실제로 WebSocket + STOMP CONNECT 시도
    return connectPromise
  }, [cleanupClient, roomId])

  /** 마운트 시 자동 연결 (원하면) */
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        await connect()
        if (cancelled) return
        console.log('초기 WebSocket 연결 완료')
      } catch (e) {
        if (cancelled) return
        console.error('초기 WebSocket 연결 실패:', e)
      }
    })()

    return () => {
      cancelled = true
      cleanupClient()
    }
  }, [connect, cleanupClient])

  /** 메시지 전송: 필요하면 연결 먼저 보장 */
  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      if (!content.trim()) return false

      const token = localStorage.getItem('access-token')
      if (!token) {
        console.error('토큰 없음, 전송 불가')
        return false
      }

      try {
        // 🔑 연결이 안 되어 있으면 여기서 기다렸다가 진행
        if (!stompClientRef.current?.connected) {
          await connect()
        }

        if (!stompClientRef.current?.connected) {
          console.error('연결 실패로 전송 불가')
          return false
        }

        const payload: SendMessagePayload = { content }

        stompClientRef.current.publish({
          destination: `/app/chat/${roomId}/send`,
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        return true
      } catch (e) {
        console.error('메시지 전송 실패:', e)
        return false
      }
    },
    [connect, roomId]
  )

  const sendTyping = useCallback(
    async (typing: boolean) => {
      if (!stompClientRef.current?.connected) {
        try {
          await connect()
        } catch {
          return
        }
      }
      if (!stompClientRef.current?.connected) return

      try {
        stompClientRef.current.publish({
          destination: `/app/chat/${roomId}/typing`,
          body: JSON.stringify({ isTyping: typing }),
          headers: { 'content-type': 'application/json' },
        })
        setIsTyping(typing)
      } catch (e) {
        console.error('타이핑 전송 실패:', e)
      }
    },
    [connect, roomId]
  )

  const markAsRead = useCallback(
    async (messageId: number) => {
      if (!stompClientRef.current?.connected) {
        try {
          await connect()
        } catch {
          return
        }
      }
      if (!stompClientRef.current?.connected) return

      try {
        stompClientRef.current.publish({
          destination: `/app/chat/${roomId}/read`,
          body: JSON.stringify({ messageId }),
          headers: { 'content-type': 'application/json' },
        })
      } catch (e) {
        console.error('읽음 처리 실패:', e)
      }
    },
    [connect, roomId]
  )

  return {
    messages,
    setMessages,
    connectionState, // 'idle' | 'connecting' | 'connected' | 'error'
    lastError,
    isTyping,
    connect,         // 필요하면 컴포넌트에서 직접 호출해서 await 가능
    sendMessage,
    sendTyping,
    markAsRead,
  }
}
