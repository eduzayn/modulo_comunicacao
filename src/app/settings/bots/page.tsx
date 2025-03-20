'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { BotForm, useBots } from '@/features/settings'

export default function BotsPage() {
  const [isCreateBotOpen, setIsCreateBotOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { 
    bots = [],
    isLoading,
    toggleBotStatus
  } = useBots()

  const filteredBots = bots.filter(bot =>
    bot.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bots ({bots.length})</h1>
          <p className="text-sm text-muted-foreground">
            Configure bots para automatizar atendimentos em diferentes canais
          </p>
        </div>

        <Dialog open={isCreateBotOpen} onOpenChange={setIsCreateBotOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo bot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <BotForm onSuccess={() => setIsCreateBotOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Pesquisar bots..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Bots</h2>
        </div>

        <div className="divide-y">
          {filteredBots.map((bot) => (
            <div key={bot.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={bot.avatar} />
                  <AvatarFallback>BOT</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{bot.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {bot.channel === 'whatsapp' && 'WhatsApp'}
                    {bot.channel === 'email' && 'E-mail'}
                    {bot.channel === 'instagram' && 'Instagram'}
                    {bot.channel === 'facebook' && 'Facebook'}
                    {bot.channel === 'widget' && 'Widget'}
                    {bot.email && ` • ${bot.email}`}
                    {bot.groups && bot.groups.length > 0 && ` • ${bot.groups.join(', ')}`}
                  </p>
                </div>
              </div>
              <Switch
                checked={bot.enabled}
                onCheckedChange={(checked) => toggleBotStatus({ id: bot.id, enabled: checked })}
              />
            </div>
          ))}

          {filteredBots.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhum bot encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 