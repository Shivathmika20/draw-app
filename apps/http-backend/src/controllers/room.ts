import { Request, Response } from 'express';
import { CreateRoomSchema } from '@repo/common-types/types';
import { prisma } from '@repo/db';

export const createRoom = async (req: Request, res: Response) => {
   const parsedData=CreateRoomSchema.safeParse(req.body);
   if(!parsedData.success){
    return res.status(400).json({message:'Invalid data'});
   }
  try{
   const userID=(req as any).userId;
   const roomInfo=await prisma.room.create({
      data:{
         slug:parsedData.data.roomName,
         adminId:userID
      }
   })
   res.json({message:'Room created successfully',roomId:roomInfo.id});
  }
  catch(e){
    return res.status(401).json({message:'Room already exists with this name'});
  }
}

