import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Conversation } from '@/types'

interface ConversationHeaderProps {
  conversation: Conversation
}

/**
 * Componente que exibe o cabeçalho da conversa com informações do contato
 * e status da conversa
 */
export function ConversationHeader({ conversation }: ConversationHeaderProps) {
  // Formatar a data da última mensagem
  const lastMessageDate = conversation.updated_at 
    ? new Date(conversation.updated_at).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date(conversation.created_at).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
  
  // Obter o nome do contato
  const contactName = conversation.contact?.name || 'Cliente'
  
  // Iniciais para o avatar
  const initials = contactName
    .split(' ')
    .map(name => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  
  // Mapeamento de status para exibição
  const statusMap: Record<string, { label: string, variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    new: { 
      label: 'Nova', 
      variant: 'default' 
    },
    open: { 
      label: 'Em atendimento', 
      variant: 'secondary' 
    },
    pending: { 
      label: 'Pendente', 
      variant: 'outline' 
    },
    closed: { 
      label: 'Encerrada', 
      variant: 'destructive' 
    },
    archived: { 
      label: 'Arquivada', 
      variant: 'outline' 
    }
  }
  
  // Definir exibição de status
  const status = statusMap[conversation.status] || { label: conversation.status, variant: 'outline' }
  
  // Definir exibição de prioridade
  const priorityMap: Record<string, { label: string, variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    high: { 
      label: 'Alta prioridade', 
      variant: 'destructive' 
    },
    medium: { 
      label: 'Média prioridade', 
      variant: 'secondary' 
    },
    low: { 
      label: 'Baixa prioridade', 
      variant: 'outline' 
    }
  }
  
  const priorityBadge = conversation.priority && priorityMap[conversation.priority]
    ? <Badge variant={priorityMap[conversation.priority].variant} className="ml-2">{priorityMap[conversation.priority].label}</Badge>
    : null
  
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={conversation.contact?.avatar || ''} alt={contactName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      
      <div>
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">
            {contactName}
          </h1>
          <Badge variant={status.variant} className="ml-2">
            {status.label}
          </Badge>
          {priorityBadge}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{conversation.channel}</span>
          <span className="mx-2">•</span>
          <span>ID: {conversation.id}</span>
          <span className="mx-2">•</span>
          <span>Última atualização: {lastMessageDate}</span>
        </div>
      </div>
    </div>
  )
} 