import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getConversation } from '@/services/conversation'
import { ConversationHeader } from './conversation-header'
import { ConversationActions } from './actions'
import { ConversationMessages } from './messages'
import { ConversationReply } from './reply'

interface ConversationPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ConversationPageProps): Promise<Metadata> {
  const conversation = await getConversation(params.id)
  
  if (!conversation) {
    return {
      title: 'Conversa não encontrada'
    }
  }
  
  return {
    title: `Conversa #${conversation.id} - ${conversation.contact?.name || 'Contato'}`
  }
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const conversation = await getConversation(params.id)
  
  if (!conversation) {
    notFound()
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <ConversationHeader conversation={conversation} />
        
        <div className="flex justify-end items-center">
          <ConversationActions conversation={conversation} />
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-4">
          <Card className="p-4">
            <Suspense fallback={<MessagesLoading />}>
              <ConversationMessages conversationId={conversation.id} />
            </Suspense>
          </Card>
          
          <Card className="p-4">
            <ConversationReply conversationId={conversation.id} />
          </Card>
        </div>
        
        <div className="md:col-span-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Detalhes da Conversa</h3>
            
            <div className="space-y-4">
              <DetailItem label="Status" value={conversationStatusLabel(conversation.status)} />
              <DetailItem label="Prioridade" value={priorityLabel(conversation.priority)} />
              <DetailItem label="Canal" value={conversation.channel} />
              <DetailItem 
                label="Atribuído para" 
                value={conversation.assigned_to ? conversation.assignee?.name || 'Agente' : 'Não atribuído'} 
              />
              <DetailItem 
                label="Data de criação" 
                value={new Date(conversation.created_at).toLocaleString('pt-BR')} 
              />
              <DetailItem 
                label="Última mensagem" 
                value={conversation.updated_at 
                  ? new Date(conversation.updated_at).toLocaleString('pt-BR') 
                  : 'N/A'} 
              />
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-lg font-semibold mb-4">Detalhes do Contato</h3>
            <div className="space-y-4">
              <DetailItem 
                label="Nome" 
                value={conversation.contact?.name || 'Desconhecido'} 
              />
              <DetailItem 
                label="Email" 
                value={conversation.contact?.email || 'N/A'} 
              />
              <DetailItem 
                label="Telefone" 
                value={conversation.contact?.phone || 'N/A'} 
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Componente para exibir itens de detalhes
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

// Componentes de carregamento
function MessagesLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Funções auxiliares para formatar labels
function conversationStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    'new': 'Nova',
    'open': 'Em atendimento',
    'closed': 'Encerrada',
    'archived': 'Arquivada',
    'pending': 'Pendente'
  }
  
  return statusMap[status] || status
}

function priorityLabel(priority?: string): string {
  const priorityMap: Record<string, string> = {
    'low': 'Baixa',
    'medium': 'Média',
    'high': 'Alta'
  }
  
  return priority ? (priorityMap[priority] || priority) : 'Normal'
} 