import { Authform } from "@/components/Authform";
export default function SignInPage() {

   
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
      />
  )
}