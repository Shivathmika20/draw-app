import {Router} from 'express';
import { authenticate } from '../middleware';
import { createRoom } from '../controllers/room';

export const roomRouter:Router = Router();

roomRouter.post('/',authenticate,createRoom);