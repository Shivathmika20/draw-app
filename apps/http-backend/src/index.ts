import 'dotenv/config';
import express from 'express';
import { authRouter } from './routes/auth-route';
import { roomRouter } from './routes/room-route';


const app=express();
app.use(express.json());


app.use('/auth',authRouter);
app.use('/room',roomRouter);


app.listen(3001,()=>{
    console.log('Server is running on port 3001');
});