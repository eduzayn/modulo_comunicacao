'use client';

import { useChannels } from '@/hooks/use-channels';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function ChannelsPage() {
  const { channels, isLoading, error } = useChannels();
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando canais...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar canais</div>;
  }
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Canais de Comunicação</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie todos os canais de comunicação da plataforma.
          </p>
        </div>
        <Button asChild>
          <Link href="/channels/new">Novo Canal</Link>
        </Button>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <Card key={channel.id} className="overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{channel.name}</h3>
              <p className="mt-1 text-sm text-gray-500">Tipo: {channel.type}</p>
              <div className="mt-2 flex items-center">
                <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                  channel.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span>{channel.status === 'active' ? 'Ativo' : 'Inativo'}</span>
              </div>
              <div className="mt-4">
                <Button asChild variant="outline">
                  <Link href={`/channels/${channel.id}`}>
                    Configurar
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
