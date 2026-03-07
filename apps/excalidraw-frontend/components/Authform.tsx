'use client'

import {SigninSchema,SignupSchema} from '@repo/common-types'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card'
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/ui/form'
import { SignupAction,SigninAction } from '@/actions/auth-server-action'
import { toast } from 'sonner'


interface AuthFileds{
  name:string;
  label:string;
  type?:string;
  placeholder?:string;
  required?:boolean;
}


interface AuthProps{
  title:string;
  fields:AuthFileds[];
  submitLabel:string;
  mode:'signin' | 'signup';

}


export const Authform = ({title,fields,submitLabel,mode}:AuthProps) => {
  const schema=mode==='signup'?SignupSchema:SigninSchema;

  const form =useForm<z.infer<typeof schema>>({
    resolver:zodResolver(schema),
    defaultValues: (mode === 'signup' 
      ? {
          username: '',
          password: '',
          name: '',
        }
      : {
          username: '',
          password: '',
        }) as z.infer<typeof schema>
  })



  const router=useRouter();
  
  const onSubmit = async (values: z.infer<typeof schema>) => {
    console.log(values)

    const res=
        mode==='signup'? await SignupAction(values as z.infer<typeof SignupSchema>)
        :await SigninAction(values as z.infer<typeof SigninSchema>);
    console.log(res);
    if(!res.success){
      console.error(res.message);
      toast.error(res.message);
      return;
    }
    form.reset();
    toast.success(res.message);
    router.push(mode==='signup'?'/signin':'/');
    
  }


  return(
    <div className="flex justify-center items-center h-screen ">
      <Card className="w-full max-w-md rounded-2xl  bg-card shadow-lg px-6 py-8">
        <CardHeader className="text-center text-bold text-2xl mb-2">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {fields.map((f)=>(
              <FormField
                key={f.name}
                control={form.control}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                name={f.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">{f.label}</FormLabel>
                    <FormControl>
                    
                        <Input
                          placeholder={f.placeholder || ''}
                          type={f.type || 'text'}
                          required={f.required}
                          {...field}
                          className='rounded-md text-foreground focus:border-primary focus:ring-primary px-2'
                        />
                      
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> 
            ))}
            <Button type="submit"  className='w-full px-4 py-2 bg-accent text-accent-foreground rounded-md hover:cursor-pointer'>
              {submitLabel}
            </Button>
          </form>
        </Form>
        </CardContent>
        
      </Card>
    </div>
  )
}