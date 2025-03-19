'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { GroupTransfer } from './group-transfer'
import { Users } from 'lucide-react'

export function ConversationActions() {
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            Mover para grupo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <GroupTransfer />
        </DialogContent>
      </Dialog>
    </div>
  )
} 