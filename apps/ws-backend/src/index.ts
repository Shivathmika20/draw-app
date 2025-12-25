import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-auth/config';


const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws,req) {
  console.log('Client connected');
  const url=req.url || ''; //ws://localhost:8080?token='12232'
  if(!url){
    return;
  }
  const urlParams=new URLSearchParams(url.split('?')[1]);
  const token=urlParams.get('token');
  if(!token){
    return;
  }
  const decoded=jwt.verify(token ,JWT_SECRET);
  if(!decoded || typeof decoded === 'string' || !decoded.userId){
    ws.close()
    return
  }
  


  ws.on('message', function message(data) {
    ws.send("pong")
  });


});
