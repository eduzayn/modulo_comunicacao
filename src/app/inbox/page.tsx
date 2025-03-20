'use client'

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'
import { InboxSidebar } from '@/components/inbox/inbox-sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import ConversationChat from '@/components/inbox/conversation-chat'

// Tipos de canais compatíveis
type ChannelType = 'whatsapp' | 'facebook' | 'instagram' | 'email' | 'sms' | 'chat'

// Interface para contatos
interface Contact {
  name: string;
  avatar: string;
  channel: ChannelType;
}

// Carregamento dinâmico dos componentes pesados - usando o any temporariamente para evitar erros de tipo
const ConversationList = dynamic(() => import('@/components/inbox/conversation-list'), { 
  loading: () => <ConversationListSkeleton />,
  ssr: false
})

const ConversationDetails = dynamic(() => import('@/components/inbox/conversation-details'), { 
  loading: () => <div className="flex-1 flex items-center justify-center"><Spinner /></div>,
  ssr: false
})

// Skeletons para melhorar a UX durante carregamento
function ConversationListSkeleton() {
  return (
    <div className="w-[320px] h-full border-r animate-pulse">
      <div className="h-14 border-b bg-muted/30"></div>
      <div className="p-4 space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-2/3 bg-muted rounded"></div>
              <div className="h-3 w-full bg-muted/70 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InboxPage() {
  const searchParams = useSearchParams()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  // Recupera o ID da conversa dos parâmetros de URL
  const conversationId = useMemo(() => 
    searchParams.get('conversation'),
  [searchParams])
  
  // Memoização do mapa de contatos para evitar recriações
  const CONTACT_MAP = useMemo<Record<string, Contact>>(() => ({
    user1: {
      name: 'João Silva',
      avatar: '/avatars/01.png',
      channel: 'whatsapp'
    },
    user2: {
      name: 'Maria Oliveira',
      avatar: '/avatars/02.png',
      channel: 'whatsapp'
    },
    user3: {
      name: 'Pedro Santos',
      avatar: '/avatars/03.png',
      channel: 'facebook'
    },
    user4: {
      name: 'Ana Costa',
      avatar: '/avatars/04.png',
      channel: 'instagram'
    },
    user5: {
      name: 'Lucas Ferreira',
      avatar: '/avatars/05.png',
      channel: 'whatsapp'
    },
    user6: {
      name: 'Juliana Alves',
      avatar: '/avatars/06.png',
      channel: 'whatsapp'
    },
    user7: {
      name: 'Roberto Dias',
      avatar: '/avatars/07.png',
      channel: 'email'
    },
    user8: {
      name: 'Fernanda Lima',
      avatar: '/avatars/08.png',
      channel: 'whatsapp'
    },
    user9: {
      name: 'Gustavo Martins',
      avatar: '/avatars/09.png',
      channel: 'instagram'
    },
    user10: {
      name: 'Camila Sousa',
      avatar: '/avatars/10.png',
      channel: 'facebook'
    }
  }), [])
  
  // Atualiza o estado com base na URL ao carregar
  useEffect(() => {
    if (conversationId) {
      setSelectedConversation(conversationId)
    }
  }, [conversationId])
  
  // Handler para seleção de conversa otimizado com useCallback
  const handleSelectConversation = useCallback((id: string) => {
    if (id !== selectedConversation) {
      setIsLoading(true)
      setSelectedConversation(id)
      
      // Simulação de carregamento - com tempo mínimo para evitar flash
      setTimeout(() => {
        setIsLoading(false)
      }, 100) // Reduzido de 800ms para 100ms para melhor UX
      
      // Atualiza a URL sem recarregar a página
      const url = new URL(window.location.href)
      url.searchParams.set('conversation', id)
      window.history.pushState({}, '', url)
    }
  }, [selectedConversation])
  
  // Determinar informações de contato para o chat selecionado
  const contactInfo = useMemo(() => {
    if (!selectedConversation) return undefined;
    
    const contact = CONTACT_MAP[selectedConversation.replace('conv-', '')] || {
      name: 'Contato',
      avatar: '',
      channel: 'whatsapp' as ChannelType
    };
    
    return {
      contactName: contact.name,
      contactAvatar: contact.avatar,
      channelType: contact.channel
    };
  }, [selectedConversation, CONTACT_MAP]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar navegação principal - carregada imediatamente */}
      <InboxSidebar />

      {/* Lista de conversas - carregamento dinâmico com suspense */}
      <ErrorBoundary>
        <main className="w-72 border-r bg-white">
          <Suspense fallback={<ConversationListSkeleton />}>
            <ConversationList
              selectedId={selectedConversation}
              onSelectConversation={handleSelectConversation}
              isLoading={isLoading}
              contactMap={CONTACT_MAP}
            />
          </Suspense>
        </main>
      </ErrorBoundary>

      {/* Detalhes da conversa - carregamento dinâmico com suspense */}
      <ErrorBoundary>
        <aside className="w-72 bg-background/50 shadow-inner">
          <Suspense fallback={
            <div className="p-4">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-24 w-full mb-2" />
              <Skeleton className="h-5 w-2/3 mb-4" />
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-32 w-full" />
            </div>
          }>
            {selectedConversation ? (
              <ConversationDetails
                contactId={selectedConversation}
                contactName={contactInfo?.contactName}
                conversation={selectedConversation ? {
                  id: selectedConversation,
                  channel: contactInfo?.channelType || 'whatsapp'
                } : undefined}
              />
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <p>Selecione uma conversa para ver detalhes</p>
              </div>
            )}
          </Suspense>
        </aside>
      </ErrorBoundary>

      {/* Área principal */}
      <section className="flex-1 relative">
        {selectedConversation ? (
          <ConversationChat
            conversationId={selectedConversation}
            contactName={contactInfo?.contactName}
            contactAvatar={contactInfo?.contactAvatar}
            channelType={contactInfo?.channelType}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground flex-col">
            <div className="max-w-md text-center space-y-2">
              <h3 className="text-xl font-medium">Selecione uma conversa</h3>
              <p className="text-sm">
                Escolha uma conversa na lista à esquerda para começar a interagir
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
} 