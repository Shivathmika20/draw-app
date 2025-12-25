import { Request, Response } from 'express';
import { CreateRoomSchema } from '@repo/common-types/types';


export const createRoom = async (req: Request, res: Response) => {
   const data=CreateRoomSchema.safeParse(req.body);
   if(!data.success){
    return res.status(400).json({message:'Invalid data'});
   }
   //db call  
   res.json({message:'Room created successfully',roomId:1});
}

