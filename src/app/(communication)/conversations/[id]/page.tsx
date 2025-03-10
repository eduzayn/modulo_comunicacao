'use client';

import React, { useState } from 'react';
import { useConversation } from '@/hooks/use-conversations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';
import { useToast } from '@/components/ui/use-toast';

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { conversation, messages, isLoading, error, sendMessage } = useConversation(params?.id as string);
  const [isSending, setIsSending] = useState(false);
  
  const handleSendMessage = async (content: string, mediaUrl?: string) => {
    if (!content.trim()) return;
    
    setIsSending(true);
    
    try {
      await sendMessage({
        senderId: 'current-user', // In a real app, this would be the authenticated user's ID
        content,
        mediaUrl,
      });
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando conversa...</div>;
  }
  
  if (error || !conversation) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar conversa</div>;
  }
  
  return (
    <div className="px-4 py-6 sm:px-0 h-[calc(100vh-6rem)]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Conversa</h1>
          <p className="mt-1 text-sm text-gray-500">
            Canal: {conversation.channelId || 'Chat Interno'}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
      
      <Card className="overflow-hidden flex flex-col h-[calc(100%-4rem)]">
        <div className="border-b px-4 py-3">
          <div className="flex items-center">
            <div>
              <h3 className="font-medium">
                {conversation.participants.length > 0 
                  ? `${conversation.participants.length} participantes` 
                  : 'Sem participantes'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {conversation.status === 'open' ? 'Conversa aberta' : 
                 conversation.status === 'closed' ? 'Conversa fechada' : 
                 'Conversa arquivada'}
                 {' • '}
                 {conversation.priority === 'high' ? 'Alta prioridade' : 
                  conversation.priority === 'medium' ? 'Média prioridade' : 
                  'Baixa prioridade'}
              </p>
            </div>
          </div>
        </div>
        
        <MessageList 
          messages={messages} 
          currentUserId="current-user" // In a real app, this would be the authenticated user's ID
        />
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          isLoading={isSending}
        />
      </Card>
    </div>
  );
}
