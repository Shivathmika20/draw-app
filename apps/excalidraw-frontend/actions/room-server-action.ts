'use server'
import {CreateRoomSchema} from "@repo/common-types/types"
import { z } from "zod"
import {cookies} from "next/headers"
import { getToken } from "./get-token-action"

export const CreateRoomAction=async(values:z.infer<typeof CreateRoomSchema>)=>{
   try{
    const cookieStore=await cookies()
    const token=cookieStore.get('token')?.value
    
      const res=await fetch('http://localhost:3001/room',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization': token? `Bearer ${token}`: ""
        },
        body:JSON.stringify(values),
      })
     const data=await res.json();
      if(!res.ok){
        return{
          success:false,
          message:data.message,
          status:res.status,
        }
        
      }
      return {success:true,message:data.message,roomId:data.roomId};
   }
   catch(e){
    return {success:false,message:'Failed to create room',error:e};
   }
}  

export const GetRoomAction=async ({roomId}:{roomId:string})=>{
  const roomSlug=roomId
  try{
    const cookieStore=await cookies()
    const token=cookieStore.get('token')?.value;
   
      const res=await fetch(`http://localhost:3001/room/${roomSlug}`,{
          method:'GET',
          headers:{
              'Content-Type':'application/json',
              'Authorization': token? `Bearer ${token}`: ""
          },
          
        })
      const data= await res.json()
      
      if(!res.ok){
        return{
          success:false,
          message:data.message,
          status:res.status,
        }      
      }
      return {success:true,message:data};
}
  catch(e){
    return {success:false,message:'Failed to load room info',error:e};
   }
 

}



