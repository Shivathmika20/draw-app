import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-auth/config';
import { SignupSchema,SigninSchema } from '@repo/common-types/types';



export const signup = async (req: Request, res: Response) => {
    const data=SignupSchema.safeParse(req.body);
    if(!data.success){
        return res.status(400).json({message:'Invalid data'});
    }
//db call

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