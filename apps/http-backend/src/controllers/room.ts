import { Request, Response } from 'express';
export const createRoom = async (req: Request, res: Response) => {
   //db call
   res.json({message:'Room created successfully'});
}