'use client'
import { Button } from '@repo/ui/components/ui/button'
import { LogIn } from 'lucide-react'
import { Input } from '@repo/ui/components/ui/input'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog'
// import { cookies } from 'next/headers'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getToken } from '@/actions/get-token-action'
import { useSocketContext } from '@/providers/SocketProvider'
import { useSocket } from '@/hooks/useSocket'


export function JoinDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [roomId, setRoomId] = useState('')
  //  const [token,setToken]=useState('')

    const router=useRouter()
    
   

    const { isConnected, lastMessage, send, connect } = useSocketContext()


    useEffect(() => {
      if (!lastMessage) return
      console.log('Got WS data in component:', lastMessage)

      if (lastMessage.type === 'error') {
        toast.error(lastMessage.message)
      }

      if (lastMessage.type === 'joined room') {

        toast.success(`Joined room ${lastMessage.roomId}`)
        console.log('Navigating to room:', lastMessage.roomId)
        router.push(`/canvas/room/${lastMessage.roomId}`)
      }
    },[lastMessage,router]
  )

  const handleUserJoin = async () => {
    const t = await getToken()
  
    if (!t) {
      toast.error('Please login to join a room')
      router.push('/signin')
      return
    }
  
    connect(t)     // 🔥 create WS connection here
    setIsOpen(true)
  }
  

  const handleJoin = async () => {
    if (!isConnected) {
      toast.error('Socket not connected yet')
      return
    }
    if (!roomId.trim()) {
      toast.error('Enter a room ID')
      return
    }
  
    send({ type: 'join-room', roomId })
    setIsOpen(false)
  }

  
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
        <DialogTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full px-8 border-border bg-secondary/50 text-foreground hover:bg-secondary hover:text-accent hover:border-accent/50"
            onClick={handleUserJoin}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Join Room
          </Button>
        </DialogTrigger>
        <DialogContent className="border-border bg-secondary">
          <DialogHeader>
            <DialogTitle className="text-foreground">Join Room</DialogTitle>
            <DialogDescription>
              Enter the room ID to join a room
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="room-name" className="text-sm font-medium text-foreground">
                Room ID
              </label>
              <Input
                id="room-id"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                className="bg-background text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleJoin}
              disabled={!roomId.trim()}
              className="bg-accent text-accent-foreground hover:bg-accent/80"
            >
              Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    )
}