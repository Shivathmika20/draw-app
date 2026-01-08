import { Authform } from "@/components/Authform";
import { SigninAction } from "@/actions/auth-server-action";
import { redirect } from "next/navigation";
import { SigninSchema } from "@repo/common-types/types";
import { z } from "zod";
export default function SignInPage() {

   const handleSignin=async (values:z.infer<typeof SigninSchema>)=>{
     try{
      const res=await SigninAction(values);
      if(!res){
        console.error("Failed to signin");
        return
      }
      redirect("/");
     }catch(e){
      console.error("Failed to signin");
     }
   }
  return (
      <Authform
        title="Signin"
        fields={
          [
            {name:"username",label:"Username",type:"text",placeholder:"Enter your username",required:true},
            {name:"password",label:"Password",type:"password",placeholder:"Enter your password",required:true},
          ]
        }
        submitLabel="Signin"
        mode="signin"
        onSubmit={handleSignin}
      />
  )
}