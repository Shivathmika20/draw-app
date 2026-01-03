import {Router} from 'express';
import { authenticate } from '../middleware';
import { createRoom } from '../controllers/room';
import { getRoom ,getChats} from '../controllers/room';


export const roomRouter:Router = Router();

roomRouter.post('/',authenticate,createRoom);

roomRouter.get('/:slug',authenticate,getRoom);

roomRouter.get('/chats/:slug',authenticate,getChats);