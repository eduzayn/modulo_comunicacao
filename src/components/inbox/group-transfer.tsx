'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGroups, moveToGroup } from '@/services/inbox'
import { Group } from '@/types/inbox'
import { 
  Users,
  Laptop,
  UserX,
  Music,
  GraduationCap,
  Award,
  Clock,
  HelpCircle,
  Wallet,
  Timer,
  Scroll,
  Loader2
} from 'lucide-react'

const iconMap = {
  Users,
  Laptop,
  UserX,
  Music,
  GraduationCap,
  Award,
  Clock,
  HelpCircle,
  Wallet,
  Timer,
  Scroll
}

interface GroupTransferProps {
  conversationId: string
  onSuccess?: () => void
}

export function GroupTransfer({ conversationId, onSuccess }: GroupTransferProps) {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: getGroups
  })

  const { mutate: handleMoveToGroup, isPending } = useMutation({
    mutationFn: (groupId: string) => moveToGroup(conversationId, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      onSuccess?.()
    }
  })

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full max-w-sm">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Mover para grupo
        </h2>

        <Input 
          type="search"
          placeholder="Pesquisar"
          className="h-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ScrollArea className="h-[400px]">
          <div className="space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredGroups.map((group) => {
              const Icon = iconMap[group.icon as keyof typeof iconMap] || Users

              return (
                <Button
                  key={group.id}
                  variant="ghost"
                  className="w-full justify-start gap-2 h-12"
                  onClick={() => handleMoveToGroup(group.id)}
                  disabled={isPending}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{group.name}</span>
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
} 