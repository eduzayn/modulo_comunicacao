'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { GroupTransfer } from './group-transfer'
import { Users } from 'lucide-react'
import { useState } from 'react'

interface ConversationActionsProps {
  conversationId: string
}

export function ConversationActions({ conversationId }: ConversationActionsProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            Mover para grupo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <GroupTransfer 
            conversationId={conversationId}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 