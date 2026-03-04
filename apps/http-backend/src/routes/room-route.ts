import {Router} from 'express';
import { authenticate } from '../middleware';
import { createRoom, getDrawings } from '../controllers/room';
import { getRoom ,getChats} from '../controllers/room';


export const roomRouter:Router = Router();

roomRouter.post('/',authenticate,createRoom);

roomRouter.get('/:roomSlug',authenticate,getRoom);

roomRouter.get('/:slug/drawings',authenticate,getDrawings);