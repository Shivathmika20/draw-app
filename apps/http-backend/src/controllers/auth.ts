import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-auth/config';
import { SignupSchema,SigninSchema } from '@repo/common-types/types';
import { prisma } from '@repo/db/client';


export const signup = async (req: Request, res: Response) => {
    const parsedData=SignupSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({message:'Invalid data'});
    }
//db call
    await prisma.user.create({
        data:{
            username:parsedData.data.username,
            password:parsedData.data.password,
            name:parsedData.data.name,
            
        }
    })

    res.json({message:'User created successfully'});
}

export const signin = async (req: Request, res: Response) => {
    
    const data=SigninSchema.safeParse(req.body);
    if(!data.success){
        return res.status(400).json({message:'Invalid data'});
    }
    const userId=1
    const token=jwt.sign({userId},JWT_SECRET,{expiresIn:'1h'});

    res.json({token,message:'Login successful'});

}