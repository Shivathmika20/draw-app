'use client'

import React, { createContext, useContext} from 'react'
import { useSocket } from '@/hooks/useSocket'

type SocketContextType = ReturnType<typeof useSocket>

const SocketContext = createContext<SocketContextType | null>(null)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socket = useSocket()
  
 
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocketContext must be used inside SocketProvider')
  return ctx
}
