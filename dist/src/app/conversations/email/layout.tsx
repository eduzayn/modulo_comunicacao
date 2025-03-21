import { Sidebar } from '@/components/layout/Sidebar'

export const metadata = {
  title: 'E-mail - Módulo de Comunicação',
  description: 'Gerencie suas conversas por e-mail em um único lugar'
}

export default function EmailLayout({
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