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
    return decoded?.userId ?? null
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
  const isMember = room.members.some((m: { id: number }) => m.id === userId);

  return { room, isAdmin, isMember };
}

function broadcastToRoom(roomId: string, payload: any) {
  users.forEach(u => {
    if (u.rooms.includes(roomId)) { 
      u.ws.send(JSON.stringify(payload));
    }
  })
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
        
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(user.userId) }
        })
      
        if (!dbUser) return
        // Add user to room
        user.rooms.push(roomId.toString());


        broadcastToRoom(roomId,{
          type: "user-joined",
          roomId,
          userId:Number(user.userId),
           message:`User ${dbUser.name} joined`
        })

        
  // send current online users to the person who joined
        ws.send(JSON.stringify({
          type: "room-users",
          users:[...new Set(
            users
              .filter(u => u.rooms.includes(roomId))
              .map(u => Number(u.userId))
          )]
        }))

        // broadcast to everyone
        
        
        ws.send(JSON.stringify({ 
          type: 'joined room', 
          roomId: roomId,
        }));

        
        // add this in join-room handler  
        console.log('all users after join:', users.map(u => ({ id: u.userId, rooms: u.rooms })))
      }
  


      if(message.type==='leave-room'){
        const roomId=message.roomId;
        const user = users.find(x => x.ws === ws);
        if(user){
          user.rooms=user?.rooms?.filter(room=>room!==roomId); //keep rooms that are not the roomId
        }

        const dbUser = await prisma.user.findUnique({
          where: { id: Number(user?.userId) }
        })
      
        if (!dbUser) return

        broadcastToRoom(roomId,{
          type: "user-left",
          roomId,
          userId:Number(user?.userId),
          message:`User ${dbUser.name} left`

        })
        
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

        // Broadcast message to all users in the room
        users.forEach(user=>{
            if(user.rooms.includes(roomSlug)){
              user.ws.send(JSON.stringify({type:'sendMessage',message:chatMessage,roomId:roomSlug,userId:user.userId}));
            }
          })
        
      }

     

      if (message.type === 'draw') {
        console.log('element received:', message.element) 
        const user = users.find(x => x.ws === ws)
        if (!user) return
      
        const roomSlug = message.roomId
        if (!user.rooms.includes(roomSlug)) return
      
        const room = await prisma.room.findUnique({
          where: { slug: roomSlug },
          select: { id: true }
        })
        if (!room) return

        const dbUser = await prisma.user.findUnique({
          where: { id: Number(user.userId) }
        })
      
        if (!dbUser) return
      
        // save to DB
        await prisma.drawing.create({
          data: {
            elementId: message.element.id,
            type:      message.element.type,
            x1:        message.element.x1,
            y1:        message.element.y1,
            x2:        message.element.x2,
            y2:        message.element.y2,
            points:    message.element.points ? JSON.stringify(message.element.points) : null,
            userId:    Number(user.userId),
            roomId:    room.id
          }
        })
        console.log('users in room:', users.filter(u => u.rooms.includes(roomSlug)).length)
      
        console.log('draw received from user:', user.userId)
        console.log('broadcasting to N users:', users.filter(u => u.rooms.includes(roomSlug)).length)
        // broadcasting
        broadcastToRoom(roomSlug,{
          type: "draw",
          element: message.element,
          roomId: roomSlug,
          message:`User ${dbUser.name} drew`
        })
          
      }

      if (message.type === 'update') {
        const user = users.find(x => x.ws === ws)
        if (!user) return
        const roomSlug = message.roomId
        if (!user.rooms.includes(roomSlug)) return
      
        // broadcast to everyone in room
       
        broadcastToRoom(roomSlug,{
          type: "update",
          element: message.element,
          roomId: roomSlug
        })
      }
      
      if (message.type === 'erase') {
        const user = users.find(x => x.ws === ws)
        if (!user) return
        const roomSlug = message.roomId
        if (!user.rooms.includes(roomSlug)) return
      
        broadcastToRoom(roomSlug,{
          type:'erase',
          elementId: message.elementId,
          roomId: roomSlug
        })
      }

     
      if (message.type === 'text-add') {
        const user = users.find(x => x.ws === ws)
        if (!user) return
        const roomSlug = message.roomId
        if (!user.rooms.includes(roomSlug)) return

        // broadcast to everyone in room
        broadcastToRoom(roomSlug,{
          type: 'text-add',
          textBox: message.textBox,
          roomId: roomSlug
        })
      }

      if (message.type === 'text-update') {
        const user = users.find(x => x.ws === ws)
        if (!user) return
        const roomSlug = message.roomId
        if (!user.rooms.includes(roomSlug)) return

        broadcastToRoom(roomSlug,{
          type: 'text-update',
          textBox: message.textBox,
          roomId: roomSlug
        })
      }

      if (message.type === 'text-erase') {
        const user = users.find(x => x.ws === ws)
        if (!user) return
        const roomSlug = message.roomId
        if (!user.rooms.includes(roomSlug)) return

        broadcastToRoom(roomSlug,{
          type: 'text-erase',
          id: message.id,
          roomId: roomSlug
        })
      }
      if (message.type === 'canvas-sync') {
        const user = users.find(x => x.ws === ws)
        if (!user) return
        const roomSlug = message.roomId
        if (!user.rooms.includes(roomSlug)) return
      
        // broadcast to everyone else
        users.forEach(u => {
          if (u.rooms.includes(roomSlug) && u.ws !== ws) {
            u.ws.send(JSON.stringify({
              type:     'canvas-sync',
              elements: message.elements,
              roomId:   roomSlug
            }))
          }
        })
      }

    } 
      catch (error) {
        console.error('Error parsing message:', error);
        ws.send(JSON.stringify({type:'error', message:'Invalid message format'}));
      }


      
      

      
    })
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    ws.on('close', () => {
      const user = users.find(u => u.ws === ws)  // ← find FIRST
    
      if (user) {
        // notify others BEFORE removing
        user.rooms.forEach(roomId => {
          users.forEach(u => {
            if (u.ws !== ws && u.rooms.includes(roomId)) {
              u.ws.send(JSON.stringify({
                type: "user-left",
                roomId,
                userId: Number(user.userId)
              }))
            }
          })
        })
      }
    
      // remove AFTER notifying
      const index = users.findIndex(u => u.ws === ws)
      if (index !== -1) users.splice(index, 1)
    
      console.log('Client disconnected')
    })
    // ws.on('close', (code, reason) => {
    //   console.log('Client disconnected. code=', code, 'reason=', reason.toString());
    // });
})