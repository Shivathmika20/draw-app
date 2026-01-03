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

export const getRoom=async(req:Request,res:Response)=>{
 const{ roomSlug}=req.params

 const room=await prisma.room.findFirst({
   where:{
      slug:roomSlug
   },
   include: {
      members: { select: { id: true, name: true } },
      admin: { select: { id: true, name: true } }
    }
 })
 if(!room){
  return res.status(404).json({message:'Room not found'});
 }
 res.json({room});
}


export const getChats=async (req:Request,res:Response)=>{
   const { slug } = req.params;
   const room = await prisma.room.findUnique({
      where: { slug },
    });
   if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const chats = await prisma.chat.findMany({
      where: { roomId: room.id },
      orderBy: { createdAt: "desc" },
      take: 200 // limit
    });
    if(!chats){
      return res.status(404).json({ message: "Chats not found" });
    }
    res.status(200).json({chats});

}

