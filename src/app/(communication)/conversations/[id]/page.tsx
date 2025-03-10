'use client';

import { useConversation } from '@/app/hooks/use-conversations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { conversation, isLoading, error, addMessage, updateStatus } = useConversation(params?.id as string);
  const [newMessage, setNewMessage] = useState('');
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando conversa...</div>;
  }
  
  if (error || !conversation) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar conversa</div>;
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    addMessage({
      content: newMessage,
      senderId: 'agent-456', // This would be the current user's ID in a real app
      type: 'text',
    });
    
    setNewMessage('');
  };
  
  const handleStatusChange = (status: 'open' | 'closed' | 'pending') => {
    updateStatus(status);
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Conversa com {conversation.participants.join(', ')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {conversation.context} - Prioridade: {conversation.priority}
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button 
            variant={conversation.status === 'open' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('open')}
          >
            Abrir
          </Button>
          <Button 
            variant={conversation.status === 'pending' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('pending')}
          >
            Pendente
          </Button>
          <Button 
            variant={conversation.status === 'closed' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('closed')}
          >
            Fechar
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        <Card className="overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {conversation.messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.senderId.startsWith('agent') ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-md p-3 rounded-lg ${
                      message.senderId.startsWith('agent') 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 text-gray-500">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button type="submit">Enviar</Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
