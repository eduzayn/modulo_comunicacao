'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, Search } from 'lucide-react'
import { PageContainer } from '@/components/ui/page-container'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ChannelCard } from './components/channel-card'
import { useChannels } from '@/app/hooks/settings/use-channels'

export default function ChannelsPage() {
  const router = useRouter()
  const { channels, isLoading, error, searchQuery, setSearchQuery } = useChannels()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <PageContainer>
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Canais de Comunicação</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os canais de comunicação conectados ao seu sistema
            </p>
          </div>
          <Button onClick={() => router.push('/settings/channels/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar canal
          </Button>
        </div>

        <div className="flex w-full max-w-sm items-center relative">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search" 
            placeholder="Buscar canais..." 
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : channels.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">Nenhum canal encontrado</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery
                ? "Nenhum canal corresponde à sua busca. Tente um termo diferente."
                : "Você ainda não tem canais configurados. Adicione seu primeiro canal."}
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => router.push('/settings/channels/new')}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar canal
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {channels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
} 