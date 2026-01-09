import { Authform } from "@/components/Authform";
import { SignupAction } from "@/actions/auth-server-action";
import { redirect } from "next/navigation";
import { SignupSchema } from "@repo/common-types/types";
import { z } from "zod";

export default function SignupPage() {
  

  return (
    <Authform
      title="Signup"
      fields={[
        { name: "username", label: "Username", type: "text", placeholder: "Enter your username",required:true },
        { name: "password", label: "Password", type: "password", placeholder: "Enter your password",required:true },
        { name: "name", label: "Name", type: "text", placeholder: "Enter your name",required:true },
        { name: "photo", label: "Photo", type: "text", placeholder: "upload your photo",required:false },
      ]}
      submitLabel="Signup"
      mode="signup"
    />
  )
}