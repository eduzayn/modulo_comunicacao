'use client';

import { useChannel } from '@/app/hooks/use-channels';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';

export default function ChannelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { channel, isLoading, error, updateChannel } = useChannel(params?.id as string);
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando canal...</div>;
  }
  
  if (error || !channel) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar canal</div>;
  }
  
  const handleStatusToggle = async () => {
    const newStatus = channel.status === 'active' ? 'inactive' : 'active';
    updateChannel({
      ...channel,
      status: newStatus,
    });
  };
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{channel.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configurações do canal de {channel.type}
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button 
            variant={channel.status === 'active' ? 'destructive' : 'default'}
            onClick={handleStatusToggle}
          >
            {channel.status === 'active' ? 'Desativar' : 'Ativar'}
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        <Card className="overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Detalhes do Canal</h3>
            
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                <p className="mt-1">{channel.type}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <div className="mt-1 flex items-center">
                  <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                    channel.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span>{channel.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Configuração</h4>
                <div className="mt-1 bg-gray-50 p-4 rounded-md">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(channel.config, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
