import { InboxSidebar } from '@/components/inbox/inbox-sidebar'
import { ConversationList } from '@/components/inbox/conversation-list'
import { ConversationDetails } from '@/components/inbox/conversation-details'

export const metadata = {
  title: 'Caixa de Entrada',
  description: 'Gerencie todas as suas conversas em um só lugar.'
}

export default function InboxPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Esquerda */}
      <aside className="w-64 border-r bg-background">
        <InboxSidebar />
      </aside>

      {/* Lista de Conversas */}
      <main className="flex-1 border-r">
        <ConversationList />
      </main>

      {/* Painel de Detalhes */}
      <aside className="w-80 bg-background">
        <ConversationDetails />
      </aside>
    </div>
  )
} 