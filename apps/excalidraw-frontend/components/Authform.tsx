'use client'

import {SigninSchema,SignupSchema} from '@repo/common-types/types'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card'
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/ui/form'

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
  onSubmit:(values:any)=>Promise<void>;
}


export const Authform = ({title,fields,submitLabel,mode,onSubmit}:AuthProps) => {
  const schema=mode==='signup'?SignupSchema:SigninSchema;

  const form =useForm<z.infer<typeof schema>>({
    resolver:zodResolver(schema as any),
    defaultValues: (mode === 'signup' 
      ? {
          username: '',
          password: '',
          name: '',
          photo: undefined,
        }
      : {
          username: '',
          password: '',
        }) as z.infer<typeof schema>
  })

  const handleFileUpload=async (e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if (!file) return

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    )
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )
    if (!res.ok) {
      throw new Error('Cloudinary upload failed')
    }

    const data = await res.json()
    console.log("cloudinary url",data.secure_url);

    // 🔑 Store URL string in RHF (this matches Zod schema)
    form.setValue('photo' as keyof z.infer<typeof schema>, data.secure_url, {
      shouldValidate: true,
      shouldDirty: true,
    })
  } catch (error) {
    console.error('Image upload error:', error)
  }
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
                name={f.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">{f.label}</FormLabel>
                    <FormControl>
                    {f.name === 'photo' ? (
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className='rounded-md text-foreground focus:border-primary focus:ring-primary px-2'
                        />
                      ) : (
                        <Input
                          placeholder={f.placeholder || ''}
                          type={f.type || 'text'}
                          required={f.required}
                          {...field}
                          className='rounded-md text-foreground focus:border-primary focus:ring-primary px-2'
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> 
            ))}
            <Button type="submit"  className='w-full px-4 py-2 bg-blue-600 rounded-md'>
              {submitLabel}
            </Button>
          </form>
        </Form>
        </CardContent>
        
      </Card>
    </div>
  )
}