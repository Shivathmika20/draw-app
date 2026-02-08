'use client'

import { useRef, useState } from 'react'

// ---- Message Types ----
type JoinedRoomMessage = {
  type: 'joined room'
  roomId: string
}

type LeftRoomMessage = {
  type: 'left room'
  roomId: string
}

type ChatMessage = {
  type: 'sendMessage'
  message: string
  roomId: string
  userId: string
}

type ErrorMessage = {
  type: 'error'
  message: string
}

export type SocketMessage =
  | JoinedRoomMessage
  | LeftRoomMessage
  | ChatMessage
  | ErrorMessage

export const useSocket = () => {
  const socketRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null)

  const connect = (token: string) => {
    if (socketRef.current) return // already connected

    const ws = new WebSocket(`ws://localhost:8080?token=${token}`)
    socketRef.current = ws

    ws.onopen = () => {
      console.log('Connected to socket')
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SocketMessage
        console.log('WS message:', data)
        setLastMessage(data)
      } catch (e) {
        console.error('Invalid WS message', e)
      }
    }

    ws.onclose = () => {
      console.log('Disconnected from socket')
      setIsConnected(false)
      socketRef.current = null
    }

    ws.onerror = (err) => {
      console.error('WS error', err)
    }
  }

  const send = (data: object) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data))
    } else {
      console.warn('WebSocket not connected')
    }
  }

  const disconnect = () => {
    socketRef.current?.close()
    socketRef.current = null
    setIsConnected(false)
  }

  return {
    isConnected,
    lastMessage,
    connect,
    send,
    disconnect,
  }
}
