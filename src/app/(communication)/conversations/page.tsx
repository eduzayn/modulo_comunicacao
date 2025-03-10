'use client';

import { useConversations } from '@/app/hooks/use-conversations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function ConversationsPage() {
  const { conversations, isLoading, error, updateStatus } = useConversations();
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando conversas...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar conversas</div>;
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberta';
      case 'closed':
        return 'Fechada';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Conversas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie todas as conversas com alunos, professores e parceiros.
          </p>
        </div>
        <Button asChild>
          <Link href="/conversations/new">Nova Conversa</Link>
        </Button>
      </div>
      
      <div className="mt-6 space-y-4">
        {conversations.map((conversation) => (
          <Card key={conversation.id} className="overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {conversation.participants.join(', ')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {conversation.messages[0]?.content.substring(0, 100)}
                    {conversation.messages[0]?.content.length > 100 ? '...' : ''}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className={`inline-block h-2 w-2 rounded-full mr-2 ${getPriorityColor(conversation.priority)}`}></span>
                      <span className="text-xs">{conversation.priority.toUpperCase()}</span>
                    </div>
                    <div className="text-xs">
                      {getStatusLabel(conversation.status)}
                    </div>
                    <div className="text-xs">
                      {conversation.context}
                    </div>
                  </div>
                </div>
                <div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/conversations/${conversation.id}`}>
                      Ver Conversa
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
