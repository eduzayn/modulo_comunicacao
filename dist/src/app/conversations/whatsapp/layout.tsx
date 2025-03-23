import { Sidebar } from '@/components/layout/Sidebar'

export const metadata = {
  title: 'Conversas WhatsApp - Módulo de Comunicação',
  description: 'Gerencie suas conversas do WhatsApp em um único lugar'
}

export default function WhatsAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  )
} 