'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGroups } from '../hooks/use-groups'
import { Skeleton } from '@/components/ui/skeleton'

export function GroupList() {
  const { data: groups, isLoading } = useGroups()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex -space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!groups?.length) {
    return (
      <div className="flex items-center justify-center rounded-lg border p-8">
        <p className="text-muted-foreground">Nenhum grupo encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <div
          key={group.id}
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full"
              style={{ backgroundColor: group.color }}
            />
            <span className="font-medium">{group.name}</span>
          </div>
          <div className="flex -space-x-2">
            {group.members.map((member) => (
              <Avatar key={member.id} className="border-2 border-white">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 