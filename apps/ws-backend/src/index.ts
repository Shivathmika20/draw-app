import 'dotenv/config';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-auth/config';
import { prisma } from '@repo/db';

const wss=new WebSocketServer({port:8080});

interface User{
    ws:WebSocket;
    userId:string;
    rooms:string[];
}

const users:User[]=[];

const checkUser = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
    if (!decoded || typeof decoded === 'string' || !decoded.userId) {
        return null;
    }
    return decoded.userId; 
  } 
  catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
};

async function canUserJoinRoom(userId: number, roomSlug: string) {
  const room = await prisma.room.findUnique({
    where: { slug: roomSlug },
    include: {
      members: { select: { id: true } },
    },
  });
  if (!room) return null;

  const isAdmin = room.adminId === userId;
  const isMember = room.members.some(m => m.id === userId);

  return { room, isAdmin, isMember };
}

wss.on('connection', (ws: WebSocket, req) => {
    console.log('Client connected');
    const url=req.url || ''; //ws://localhost:8080?token='12232'
    if(!url){
        return;
    }
    const urlParams=new URLSearchParams(url.split('?')[1]);
    const token=urlParams.get('token') || '';
    const userId=checkUser(token);
    if(!userId){
        ws.close();
        return null;
    }

    users.push(
        {
            userId,
            rooms:[],
            ws
        }
    )
    

    ws.on('message',async (data)=>{
      console.log('message received',data.toString());
      try {
        const message=JSON.parse(data.toString())

      if (message.type === 'join-room' && !message.roomId) {
          ws.send(JSON.stringify({ type: 'error', message: 'roomId required' }));
          return;
        }
        
      if(message.type==='join-room'){
        const roomId=message.roomId;
        const user = users.find(x => x.ws === ws);
        
        if(!user){
          ws.send(JSON.stringify({ type: 'error', message: 'User not found' }));
          return;
        }
        
        // Check room authorization
        const authResult = await canUserJoinRoom(Number(user.userId),roomId.toString());
        
        

        if(!authResult){
          ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
          return;
        }

        const { room, isAdmin, isMember } = authResult;

        if(!isAdmin && !isMember){
         await prisma.room.update({
          where: { id: room.id },
          data: {
            members: {
              connect: { id: Number(user.userId) }
            }
          }
         })
        }
        
        // Check if user is already in the room
        if(user.rooms.includes(roomId.toString())){
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Already in this room' 
          }));
          return;
        }
        
        // Add user to room
        user.rooms.push(roomId.toString());
        ws.send(JSON.stringify({ 
          type: 'joined room', 
          roomId: roomId,
        }));
      }

      if(message.type==='leave-room'){
        const roomId=message.roomId;
        const user = users.find(x => x.ws === ws);
        if(user){
          user.rooms=user?.rooms?.filter(room=>room!==roomId); //keep rooms that are not the roomId
        }
        ws.send(JSON.stringify({ 
          type: 'left room', 
          roomId: roomId,
        }));
      }

      if(message.type==='chat'){
        const chatMessage=message.message;
        const roomSlug=message.roomId;
        const user = users.find(x => x.ws === ws);
        
        if(!user){
          ws.send(JSON.stringify({ type: 'error', message: 'User not found' }));
          return;
        }
        
        // Check if user is in the room before sending message
        if(!user.rooms.includes(roomSlug)){
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Join room before sending messages' 
          }));
          return;
        }

        const room=await prisma.room.findUnique({
          where: { slug: roomSlug },
          select: { id: true },
        })
        if(!room){
          ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
          return;
        }

        await prisma.chat.create({
          data: {
            message: chatMessage,
            userId:Number(user.userId),
            roomId:room.id
          }
        })
        // Broadcast message to all users in the room
        users.forEach(user=>{
            if(user.rooms.includes(roomSlug)){
              user.ws.send(JSON.stringify({type:'sendMessage',message:chatMessage,roomId:roomSlug,userId:user.userId}));
            }
          })
        
      }
      } catch (error) {
        console.error('Error parsing message:', error);
        ws.send(JSON.stringify({type:'error', message:'Invalid message format'}));
      }
    })
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    ws.on('close', () => {
      const index = users.findIndex(user => user.ws === ws);
      if (index !== -1) {
        users.splice(index, 1);
      }
      console.log('Client disconnected');
      
    });
})