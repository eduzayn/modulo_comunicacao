'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useEmitEvent } from '@/hooks/useEmitEvent'
import { Conversation } from '@/types'

// Ícones
import { 
  CheckCircle, 
  MessageCircle, 
  UserPlus, 
  AlertCircle, 
  Trash, 
  Loader2 
} from 'lucide-react'

interface ConversationActionsProps {
  conversation: Conversation
}

/**
 * Componente de ações para a página de detalhes da conversa
 * Demonstra a utilização de eventos para executar ações sobre a conversa
 */
export function ConversationActions({ conversation }: ConversationActionsProps) {
  const router = useRouter()
  const { emitEvent, isLoading } = useEmitEvent()
  const [currentAction, setCurrentAction] = useState<string | null>(null)
  
  /**
   * Executa uma ação na conversa emitindo o evento correspondente
   */
  const executeAction = async (
    actionType: string, 
    eventType: 'conversation.assigned' | 'conversation.closed' | 'conversation.updated', 
    payload: Record<string, any>
  ) => {
    setCurrentAction(actionType)
    
    try {
      // Adicionar o ID da conversa ao payload
      const eventPayload = {
        id: conversation.id,
        ...payload
      }
      
      // Emitir evento
      const result = await emitEvent(eventType, eventPayload)
      
      if (result.success) {
        toast.success(`Ação "${actionType}" realizada com sucesso!`)
        router.refresh() // Atualizar dados da página
      } else {
        toast.error(`Erro ao executar ação: ${result.error}`)
      }
    } catch (error) {
      toast.error(`Erro ao executar ação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setCurrentAction(null)
    }
  }
  
  /**
   * Atribuir conversa a um atendente
   */
  const assignToAgent = async () => {
    // Em um caso real, você abriria um modal para selecionar o atendente
    // Por enquanto, vamos usar um ID fixo como exemplo
    const agentId = 'agent-123'
    
    await executeAction(
      'Atribuir conversa', 
      'conversation.assigned', 
      {
        previousStatus: conversation.status,
        status: 'open',
        assigned_to: agentId,
        assignedAt: new Date().toISOString(),
        metadata: {
          assignmentMethod: 'manual',
          assignedBy: 'current-user' // Em um caso real, seria o ID do usuário logado
        }
      }
    )
  }
  
  /**
   * Fechar a conversa
   */
  const closeConversation = async () => {
    await executeAction(
      'Fechar conversa', 
      'conversation.closed', 
      {
        previousStatus: conversation.status,
        status: 'closed',
        metadata: {
          closedBy: 'current-user', // Em um caso real, seria o ID do usuário logado
          closureReason: 'resolved'
        }
      }
    )
  }
  
  /**
   * Marcar conversa como prioritária
   */
  const markAsPriority = async () => {
    await executeAction(
      'Marcar como prioritária', 
      'conversation.updated', 
      {
        priority: 'high',
        previousPriority: conversation.priority,
        metadata: {
          updatedBy: 'current-user', // Em um caso real, seria o ID do usuário logado
          reasonForUpdate: 'priority-change'
        }
      }
    )
  }
  
  /**
   * Descartar/arquivar conversa
   */
  const archiveConversation = async () => {
    await executeAction(
      'Arquivar conversa', 
      'conversation.updated', 
      {
        previousStatus: conversation.status,
        status: 'archived',
        metadata: {
          archivedBy: 'current-user', // Em um caso real, seria o ID do usuário logado
          archiveReason: 'not-relevant'
        }
      }
    )
  }
  
  /**
   * Renderiza o botão de ação com estado de carregamento
   */
  const ActionButton = ({ 
    label, 
    action, 
    icon: Icon, 
    variant = 'default'
  }: { 
    label: string, 
    action: () => Promise<void>,
    icon: React.ElementType,
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  }) => (
    <Button 
      variant={variant} 
      onClick={action} 
      disabled={isLoading} 
      className="gap-2 flex items-center"
    >
      {currentAction === label ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {label}
    </Button>
  )
  
  // Renderizar diferentes ações com base no status da conversa
  if (conversation.status === 'closed') {
    return (
      <div className="flex space-x-2">
        <ActionButton 
          label="Reabrir conversa" 
          action={() => executeAction(
            'Reabrir conversa', 
            'conversation.updated', 
            {
              previousStatus: 'closed',
              status: 'open',
              metadata: { reopenedBy: 'current-user' }
            }
          )} 
          icon={MessageCircle} 
          variant="secondary"
        />
        <ActionButton 
          label="Arquivar" 
          action={archiveConversation} 
          icon={Trash} 
          variant="ghost"
        />
      </div>
    )
  }
  
  return (
    <div className="flex space-x-2 flex-wrap gap-2">
      {!conversation.assigned_to && (
        <ActionButton 
          label="Atribuir" 
          action={assignToAgent} 
          icon={UserPlus} 
          variant="secondary"
        />
      )}
      
      <ActionButton 
        label="Marcar como prioritária" 
        action={markAsPriority} 
        icon={AlertCircle} 
        variant={conversation.priority === 'high' ? 'ghost' : 'outline'}
      />
      
      <ActionButton 
        label="Encerrar conversa" 
        action={closeConversation} 
        icon={CheckCircle} 
      />
    </div>
  )
} 