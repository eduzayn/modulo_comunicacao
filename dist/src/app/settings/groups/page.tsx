'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CreateGroupDialog } from './components/create-group-dialog'
import { GroupList } from './components/group-list'

export default function GroupsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Grupos</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          + Novo grupo
        </Button>
      </div>

      <div className="mt-4">
        <GroupList />
      </div>

      <CreateGroupDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
} 