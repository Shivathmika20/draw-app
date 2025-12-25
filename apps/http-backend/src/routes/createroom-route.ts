import {Router} from 'express';
const createRoomRouter:Router = Router();
import { authenticate } from '../middleware';
import { createRoom } from '../controllers/room';

createRoomRouter.post('/create',authenticate,createRoom);