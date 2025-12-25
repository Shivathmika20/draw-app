import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-auth/config';
export const signup = async (req: Request, res: Response) => {
//db call

res.json({message:'User created successfully'});
}

export const signin = async (req: Request, res: Response) => {
    

    const userId=1
    const token=jwt.sign({userId},JWT_SECRET,{expiresIn:'1h'});

    res.json({token,message:'Login successful'});

}