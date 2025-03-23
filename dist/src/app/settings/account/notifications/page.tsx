'use client'

import { Switch } from '@/components/ui/switch'
import { Volume2, BellRing } from 'lucide-react'

interface NotificationOption {
  id: string
  title: string
  defaultChecked: boolean
}

const soundNotifications: NotificationOption[] = [
  {
    id: 'new-message',
    title: 'Quando receber nova mensagem',
    defaultChecked: true,
  },
  {
    id: 'assigned-message',
    title: 'Quando receber nova mensagem atribuída a mim',
    defaultChecked: false,
  },
  {
    id: 'new-conversation',
    title: 'Quando receber nova conversa',
    defaultChecked: true,
  },
  {
    id: 'team-message',
    title: 'Quando receber mensagem de time',
    defaultChecked: false,
  },
  {
    id: 'other-workspace',
    title: 'Quando receber notificação de outro ambiente',
    defaultChecked: false,
  },
  {
    id: 'deal-won',
    title: 'Quando ganhar uma negociação',
    defaultChecked: true,
  },
]

const pushNotifications: NotificationOption[] = [
  {
    id: 'push-assigned',
    title: 'Quando receber nova mensagem atribuída a mim',
    defaultChecked: true,
  },
  {
    id: 'push-unassigned',
    title: 'Quando receber nova mensagem sem atribuição',
    defaultChecked: true,
  },
  {
    id: 'push-other-member',
    title: 'Quando receber nova mensagem para outro membro',
    defaultChecked: false,
  },
  {
    id: 'push-new-conversation',
    title: 'Quando receber nova conversa',
    defaultChecked: true,
  },
  {
    id: 'push-assigned-conversation',
    title: 'Quando conversa for atribuída a mim',
    defaultChecked: true,
  },
  {
    id: 'push-resolved',
    title: 'Quando conversa for resolvida',
    defaultChecked: false,
  },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-xl font-semibold">Notificações</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            <h2 className="text-lg font-medium">Notificações de Som</h2>
          </div>
          <div className="space-y-4">
            {soundNotifications.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{option.title}</span>
                <Switch defaultChecked={option.defaultChecked} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            <h2 className="text-lg font-medium">Notificações de Push</h2>
          </div>
          <div className="space-y-4">
            {pushNotifications.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{option.title}</span>
                <Switch defaultChecked={option.defaultChecked} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 