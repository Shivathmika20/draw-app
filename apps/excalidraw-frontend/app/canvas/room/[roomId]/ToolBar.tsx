'use client'
import { Room ,Member} from '@repo/common-types/roomtypes'
import { Button } from '@repo/ui/components/ui/button';
import { UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSocketContext } from '@/providers/SocketProvider'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation';

type ToolBarProps = {
  room: Room;
};

const ToolBar = ({ room }: ToolBarProps) => {

  const [open,setOpen]=useState(false)
  const router=useRouter()
  const {  lastMessage, send} = useSocketContext()

  useEffect(() => {
    if (!lastMessage) return
    console.log('Got WS data in component:', lastMessage)

    if (lastMessage.type === 'error') {
      toast.error(lastMessage.message)
    }

    if (lastMessage.type === 'left room') {

      toast.success(`left room ${lastMessage.roomId}`)
      console.log('Navigating to room:', lastMessage.roomId)
      router.push(`/`)
    }
  },[lastMessage]
)

  const handleLeave=()=>{
    

    send({
      type:"leave-room",
      roomId:room.slug
    })
  }
  
  return (
    <div className="p-4 border-b flex justify-between items-center">
      {/* left  */}
      <div>
        <h2 className="font-bold text-lg">{room.slug.toUpperCase()}</h2>
        <p className="text-sm text-gray-500">
          Admin: {room.admin.name}
        </p>
      </div>
    
      {/* right */}
      <div className='flex gap-4 '>
       <div>
        <Button className='relative rounded-full px-3 text-accent bg-transparent border border-accent  hover:bg-transparent hover:cursor-pointer'
          onClick={()=>(setOpen(prev => !prev))}
        >
            <UsersRound/>
        </Button>
       </div>
        <div>
        <Button className='hover:cursor-pointer' onClick={handleLeave}>Leave Room</Button>
        </div>
      </div>

      {/* dropdown */}
      {open && (
          <div className='absolute right-5 top-18 w-40 bg-zinc-900 border rounded-lg shadow-lg p-3 text-foreground'>
              <div className='space-y-2 '>
         
                  {room.members && room.members.length > 0 ? (
                    room.members.map((member: Member) => (
                      <div key={member.id} className='flex items-center space-x-2'>
                        <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold">
                          <span>{member.name?.[0]?.toUpperCase()}</span>
                        </div>
                        <div>
                          <span>{member.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      No one joined yet
                    </span>
                  )}
            </div>
        </div>
      )}

  </div>
  )
}

export default ToolBar
