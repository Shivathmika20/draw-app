import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-auth/config';
import { SignupSchema,SigninSchema } from '@repo/common-types/types';
import { prisma } from '@repo/db';


export const signup = async (req: Request, res: Response) => {
    const parsedData=SignupSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({message:'Invalid data'});
    }
    console.log(parsedData.data);
    try{
        const userInfo=await prisma.user.create({
            data:{
                username:parsedData.data.username,
                password:parsedData.data.password,
                name:parsedData.data.name,
                
            }
        })
        console.log(userInfo);
        res.json({message:'User created successfully',userInfo});
    }
    catch(e){
        return res.status(401).json({message:'User already exists',error:e});
    }
}

export const signin = async (req: Request, res: Response) => {
    
    const parsedData=SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({message:'Invalid data'});
    }
    const userId=1
    const token=jwt.sign({userId},JWT_SECRET,{expiresIn:'1h'});

    res.json({token,message:'Login successful'});

}