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

export function CreateDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [roomName, setRoomName] = useState('')

  const handleCreate = () => {
    if (roomName.trim()) {
      console.log('Creating room:', roomName)
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
