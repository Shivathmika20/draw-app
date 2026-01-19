'use client'

import { useState } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog'
import { Plus } from 'lucide-react'
import { CreateRoomAction } from '../actions/room-server-action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function CreateDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [roomName, setRoomName] = useState('')
  const router=useRouter()
  const handleCreate = async () => {
    if (roomName.trim()) {
      const res=await CreateRoomAction({roomName:roomName})
      console.log(res)
      if(!res.success){
        if(res.status===401 ){
          toast.error(`${res.message}:Please login to create a room`)
          router.push('/signin')
          return;
        }
        if(res.status===403){
          toast.error(`${res.message}`)
          return;
        }
        if(res.status===409){
          toast.error(`${res.message}`)
          return;
        }
        if(res.status===500){
          toast.error(`${res.message}`)
          return;
        }
        if(res.status===400){
          toast.error(`${res.message}`)
          return;
        }
        toast.error(`${res.message}`)
        return;
      }
      toast.success(`${res.message},Room ID:${res.roomId}`)
      setRoomName('')
      setIsOpen(false)
  
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="h-12 rounded-full bg-accent px-8 text-accent-foreground hover:bg-accent/80 shadow-lg shadow-accent/25"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-secondary">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Room</DialogTitle>
          <DialogDescription>
            Enter a name for your new drawing room
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="room-name" className="text-sm font-medium text-foreground">
              Room Name
            </label>
            <Input
              id="room-name"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="bg-background text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-border text-foreground hover:bg-secondary"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={!roomName.trim()}
            className="bg-accent text-accent-foreground hover:bg-accent/80"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
