"use client";

import { useCallback, useRef, useState } from "react";
import { ExtendedDrawElement } from "../components/CanvasBoard";
import { TextBox } from "../components/CanvasBoard";
import { toast } from "sonner";
// ---- Message Types ----
type JoinedRoomMessage = {
	type: "joined room";
	roomId: string;
};

type LeftRoomMessage = {
	type: "left room";
	roomId: string;
};

type UserJoinedMessage = {
	type: "user-joined";
	userId: number;
	roomId: string;
	message:string;
};

type UserLeftMessage = {
	type: "user-left";
	userId: number;
	roomId: string;
	message:string;

};

type RoomUsersMessage = {
	type: "room-users";
	users: number[];
};

type ChatMessage = {
	type: "sendMessage";
	message: string;
	roomId: string;
	userId: string;
};

type ErrorMessage = {
	type: "error";
	message: string;
};

type DrawMessage = {
	type: "draw";
	element: ExtendedDrawElement;
	roomId: string;
	message:string;

};

type EraseMessage = {
	type: "erase";
	elementId: string;
	roomId: string;
};

type SyncMessage = {
	type: "sync";
	elements: ExtendedDrawElement[];
	roomId: string;
};

type UpdateMessage = {
	type: "update";
	element: ExtendedDrawElement;
	roomId: string;
};


type TextAddMessage = {
	type: 'text-add'
	textBox: TextBox
	roomId: string
  }
  
  type TextUpdateMessage = {
	type: 'text-update'
	textBox: TextBox
	roomId: string
  }
  
type TextEraseMessage = {
	type: 'text-erase'
	id: string
	roomId: string
  }

type ActivityMessage = {
	type: "activity"
	message: string
  }

type CanvasSyncMessage = {
	type: "canvas-sync"
	elements: ExtendedDrawElement[]
	roomId: string
  }

export type SocketMessage =
	| JoinedRoomMessage
	| LeftRoomMessage
	| UserJoinedMessage
	| UserLeftMessage
	| RoomUsersMessage
	| ChatMessage
	| ErrorMessage
	| DrawMessage
	| UpdateMessage
	| SyncMessage
	| EraseMessage
	| TextAddMessage
    | TextUpdateMessage
    | TextEraseMessage
  	| ActivityMessage
  	| CanvasSyncMessage

export const useSocket = () => {
	const socketRef = useRef<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null);
	const listenersRef = useRef<((msg: SocketMessage) => void)[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
	// const [activities, setActivities] = useState<string[]>([])

	const onMessage = useCallback((cb: (msg: SocketMessage) => void) => {
		listenersRef.current.push(cb);
		// return cleanup function
		return () => {
			listenersRef.current = listenersRef.current.filter((l) => l !== cb);
		};
	}, []);

	const connect = (token: string) => {
		if (socketRef.current) return; // already connected

		const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
		socketRef.current = ws;

		ws.onopen = () => {
			console.log("Connected to socket");
			setIsConnected(true);
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data) as SocketMessage;
				console.log("raw ws message:", data.type);
        		// console.log("raw ws message:", data.type, "listeners count:", listenersRef.current.length)
				// ── Room events → useState (these are infrequent, no cascade risk) ──
				if (
					data.type === "room-users" ||
					data.type === "user-joined" ||
					data.type === "user-left" ||
					data.type === "joined room" ||
					data.type === "left room" ||
					data.type === "error"
				) {
					setLastMessage(data);
					if (data.type === "room-users") setOnlineUsers(data.users);
					if (data.type === "user-joined"){
						toast(data.message)
						setOnlineUsers((prev) => [...prev, data.userId]);
					
					}
						
					if (data.type === "user-left")

					{
						toast(data.message)
						setOnlineUsers((prev) =>
							prev.filter((id) => id !== data.userId),
					
						);
					}	
					return;
				}
				if(data.type==="draw"){
					toast(data.message)
				}
				

				// ── Drawing events → direct callback (no setState, no cascade) ──
				listenersRef.current.forEach((cb) => cb(data));
			} catch (e) {
				console.error("Invalid WS message", e);
			}
		};

		ws.onclose = () => {
			console.log("Disconnected from socket");
			setIsConnected(false);
			socketRef.current = null;
		};

		ws.onerror = (err) => {
			console.error("WS error", err);
		};
	};

	const send = (data: object) => {
		if (
			socketRef.current &&
			socketRef.current.readyState === WebSocket.OPEN
		) {
			socketRef.current.send(JSON.stringify(data));
		} else {
			console.warn("WebSocket not connected");
		}
	};

	const disconnect = () => {
		socketRef.current?.close();
		socketRef.current = null;
		setIsConnected(false);
	};

	return {
		isConnected,
		lastMessage,
		onMessage,
		onlineUsers,
		connect,
		send,
		disconnect,
		
	};
};
