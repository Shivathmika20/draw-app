'use client'

import { escape } from "querystring"
import { useEffect, useState,useRef } from "react"

export const useSocket = (token:string | null) => {
    const socketRef=useRef<WebSocket | null>(null)
    const [isConnected,setIsConnected]=useState(false)


    useEffect(()=>{
        if(!token) return;
        const ws =new WebSocket(`ws://localhost:8080?token=${token}`)
        socketRef.current=ws;

        ws.onopen=()=>{
            console.log('Connected to socket')
            setIsConnected(true)
        }
        ws.onmessage=(event)=>{
            const data=JSON.parse(event.data)
            console.log(data)
        }
        ws.onclose=()=>{
            console.log('Disconnected from socket')
            setIsConnected(false)
        }
        ws.onerror = (err) => {
            console.error("WS error", err);
        };

        return () => {
            ws.close();
          };
    },[token])
    
    return {
        ws: socketRef.current,
          isConnected,
     };
}