'use server'
import { SigninSchema,SignupSchema } from "@repo/common-types/types"
import { z } from "zod"
import {cookies} from "next/headers"


export const SignupAction=async (values:z.infer<typeof SignupSchema>)=>{
   try{
      const res=await fetch("http://localhost:3000/api/auth/signup",{
        method:'POST',
        body:JSON.stringify(values),
      })
      console.log(res);
      return res.ok?true:false;
   
   }catch(e){
    return false;
   }    
}

export const SigninAction=async (values:z.infer<typeof SigninSchema>)=>{
    try{
        const res=await fetch("http://localhost:3000/api/auth/signin",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(values),
        })
        const data=await res.json();
        console.log(data);
        if (!res.ok) {
            return { success: false, message: data.message }
        }

         (await cookies()).set({
            name:'token',
            value:data.token,
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            maxAge:60*60*24*30,
            path:'/',
        })
        return { success: true, message: data.message }

    }catch(e){
        return false;
    }
}
