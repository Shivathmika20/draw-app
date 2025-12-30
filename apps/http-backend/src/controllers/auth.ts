import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-auth/config';
import { SignupSchema,SigninSchema } from '@repo/common-types/types';
import { prisma } from '@repo/db';
import bcrypt from 'bcrypt';


export const signup = async (req: Request, res: Response) => {
    const parsedData=SignupSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({message:'Invalid data'});
    }
    console.log(parsedData.data);
    try{
        const existingUser=await prisma.user.findFirst({
            where:{
                username:parsedData.data.username,
            }
            
        })
        if(existingUser){
            return res.status(401).json({message:'User already exists'});
        }

        const hashedPassword=await bcrypt.hash(parsedData.data.password,10);
        const userInfo=await prisma.user.create({
            data:{
                username:parsedData.data.username,
                password:hashedPassword,
                name:parsedData.data.name,
                photo:parsedData.data.photo,
            }
        })
        return res.json({message:'User signed up successfully',userId:userInfo.id});
    }
    catch(e){
        return res.status(401).json({message:'failed to signup',error:e});
    }
}

export const signin = async (req: Request, res: Response) => {
    
    const parsedData=SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({message:'Invalid data'});
    }
    try{
        const user=await prisma.user.findFirst({
            where:{
                username:parsedData.data.username,
            }
        })

        if(!user){
            return res.status(401).json({message:'User doesnt exist please signup'});
        }
    
        const isPasswordValid=await bcrypt.compare(parsedData.data.password,user?.password);
        if(isPasswordValid){
            if(!JWT_SECRET){
                return res.status(401).json({message:'JWT_SECRET is not set'});
            }
            const token=jwt.sign({userId:user.id},JWT_SECRET,{expiresIn:'1h'});
            return res.status(200).json({token,message:'Login successful'});
        }
        else{
            return res.status(401).json({message:'Invalid password'});
        }
   
        
    }catch(e){
        return res.status(401).json({message:'Failed to login',error:e});
    }
    


}