import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-auth/config';


const wss = new WebSocketServer({ port: 8080 });

interface User{
  ws:WebSocket,
  userId:string,
  rooms:string[],
}

const users:User[]=[]

function checkUser(token: string): string | null {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded || typeof decoded === 'string' || !decoded.userId) {
    return null;
    }
    return decoded.userId;
}
  

wss.on('connection', function connection(ws,req) {
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

  users.push({
   userId,
   rooms:[],
   ws:ws as unknown as WebSocket 
  })

  
  ws.on('message', function message(data) {
    ws.send("pong")
  });


});
