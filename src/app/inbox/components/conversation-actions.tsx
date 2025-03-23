'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useConversationEvents } from '@/hooks/useConversationEvents'
import { createClient } from '@supabase/supabase-js'
import { 
  UserPlus, 
  XCircle, 
  CheckCircle, 
  Users, 
  ChevronDown, 
  Loader2 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'
import { logger } from '@/lib/logger'

// Cliente Supabase para operações no banco de dados
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Mock de dados - em produção, seria substituído por consultas reais
const users = [
  { id: 'user-1', name: 'Ana Lucia' },
  { id: 'user-2', name: 'Erick Moreira' },
  { id: 'user-3', name: 'Daniela Tovar' }
]

const groups = [
  { id: 'group-1', name: 'Vendas' },
  { id: 'group-2', name: 'Suporte' },
  { id: 'group-3', name: 'Atendimento' }
]

interface ConversationActionsProps {
  conversationId: string
  channelId: string
  status: string
  assignedTo?: string
}

export function ConversationActions({ 
  conversationId, 
  channelId, 
  status, 
  assignedTo 
}: ConversationActionsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { 
    emitConversationAssigned, 
    emitConversationClosed,
    isLoading
  } = useConversationEvents()
  
  // Verificar se a conversa já está atribuída
  const isAssigned = !!assignedTo
  
  // Verificar se a conversa está fechada
  const isClosed = status === 'closed'
  
  // Função para atribuir conversa a um usuário
  const handleAssignToUser = async (userId: string) => {
    try {
      await emitConversationAssigned({
        conversationId,
        channelId,
        assignedTo: userId,
        metadata: {
          assignmentType: 'manual',
          previouslyAssigned: assignedTo
        }
      })
    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao atribuir conversa: ${err.message}`, {
        conversationId,
        userId,
        stack: err.stack
      })
    }
  }
  
  // Função para atribuir conversa a um grupo
  const handleAssignToGroup = async (groupId: string) => {
    try {
      // Obter usuário do grupo com menor carga de trabalho
      const { data: groupUser, error } = await supabase
        .rpc('get_least_busy_user_from_group', { group_id: groupId })
        .single()
      
      if (error || !groupUser) {
        throw new Error(`Erro ao obter usuário do grupo: ${error?.message || 'Nenhum usuário disponível'}`)
      }
      
      // Emitir evento de atribuição para o usuário selecionado
      await emitConversationAssigned({
        conversationId,
        channelId,
        assignedTo: groupUser.user_id,
        metadata: {
          assignmentType: 'group',
          groupId,
          previouslyAssigned: assignedTo
        }
      })
    } catch (error) {
      const err = error as Error
      toast({
        title: 'Erro ao atribuir conversa',
        description: err.message,
        variant: 'destructive'
      })
    }
  }
  
  // Função para pegar a conversa para si
  const handleSelfAssign = async () => {
    try {
      // Em produção, obter ID do usuário autenticado
      const currentUserId = 'user-1' // Exemplo: usuário atual
      
      await emitConversationAssigned({
        conversationId,
        channelId,
        assignedTo: currentUserId,
        metadata: {
          assignmentType: 'self',
          previouslyAssigned: assignedTo
        }
      })
    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao atribuir conversa: ${err.message}`, {
        conversationId,
        stack: err.stack
      })
    }
  }
  
  // Função para fechar conversa
  const handleCloseConversation = async () => {
    try {
      await emitConversationClosed({
        conversationId,
        channelId,
        metadata: {
          closeReason: 'manual'
        }
      })
      
      setIsConfirmOpen(false)
    } catch (error) {
      const err = error as Error
      toast({
        title: 'Erro ao fechar conversa',
        description: err.message,
        variant: 'destructive'
      })
    }
  }
  
  return (
    <div className="flex items-center gap-2">
      {/* Botão de pegar para si (caso não esteja atribuída) */}
      {!isAssigned && !isClosed && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSelfAssign}
          disabled={isLoading.conversationAssigned}
        >
          {isLoading.conversationAssigned ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4 mr-2" />
          )}
          Pegar para mim
        </Button>
      )}
      
      {/* Dropdown de atribuição */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            disabled={isClosed || isLoading.conversationAssigned}
          >
            <Users className="h-4 w-4 mr-2" />
            Atribuir
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Atribuir para</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Atendentes</DropdownMenuLabel>
          {users.map(user => (
            <DropdownMenuItem
              key={user.id}
              onClick={() => handleAssignToUser(user.id)}
            >
              {user.name}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Grupos</DropdownMenuLabel>
          {groups.map(group => (
            <DropdownMenuItem
              key={group.id}
              onClick={() => handleAssignToGroup(group.id)}
            >
              {group.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Diálogo de confirmação para fechar conversa */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant={isClosed ? "ghost" : "outline"} 
            size="sm"
            disabled={isLoading.conversationClosed || (isClosed && !isAssigned)}
          >
            {isClosed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Fechada
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Fechar
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fechar conversa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja fechar esta conversa? Ela será movida para o histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCloseConversation}
              disabled={isLoading.conversationClosed}
            >
              {isLoading.conversationClosed ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fechando...
                </>
              ) : (
                'Fechar conversa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 