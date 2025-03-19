'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PageTransition } from './PageTransition'
import { MessageSquare, Users, BarChart2, Settings, Home, Book, GraduationCap, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Breadcrumbs } from './Breadcrumbs'

interface MenuItem {
  name: string
  href: string
  icon: any // Temporariamente usando 'any' para os ícones
}

interface BaseLayoutProps {
  children: ReactNode
  module: 'communication' | 'student' | 'content' | 'enrollment'
  items?: {
    title: string
    href: string
    icon: React.ReactNode
  }[]
}

const moduleMenuItems: Record<'communication' | 'student' | 'content' | 'enrollment', MenuItem[]> = {
  communication: [
    { name: 'Início', href: '/communication', icon: Home },
    { name: 'Chat', href: '/communication/chat', icon: MessageSquare },
    { name: 'Contatos', href: '/communication/contacts', icon: Users },
    { name: 'Estatísticas', href: '/communication/stats', icon: BarChart2 },
    { name: 'Configurações', href: '/communication/settings', icon: Settings }
  ],
  student: [
    { name: 'Início', href: '/student', icon: Home },
    { name: 'Alunos', href: '/student/list', icon: Users },
    { name: 'Configurações', href: '/student/settings', icon: Settings }
  ],
  content: [
    { name: 'Início', href: '/content', icon: Home },
    { name: 'Materiais', href: '/content/materials', icon: Book },
    { name: 'Configurações', href: '/content/settings', icon: Settings }
  ],
  enrollment: [
    { name: 'Início', href: '/enrollment', icon: Home },
    { name: 'Matrículas', href: '/enrollment/list', icon: GraduationCap },
    { name: 'Documentos', href: '/enrollment/documents', icon: FileText },
    { name: 'Configurações', href: '/enrollment/settings', icon: Settings }
  ]
}

const menuVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  })
}

export function BaseLayout({ children, module, items = [] }: BaseLayoutProps) {
  const pathname = usePathname()
  const menuItems = moduleMenuItems[module]
  
  // Gera os itens do breadcrumb baseado no pathname atual
  const breadcrumbItems = pathname.split('/').filter(Boolean).map((segment, index, array) => {
    const href = '/' + array.slice(0, index + 1).join('/')
    const matchingItem = items.find(item => item.href === href)
    const title = matchingItem ? matchingItem.title : segment
    return { href, title }
  })

  return (
    <div className="flex min-h-screen">
      <Sidebar module={module} items={items} />
      <div className="flex-1">
        <Header />
        <main className="flex-1 space-y-4 p-8 pt-6">
          <Breadcrumbs items={breadcrumbItems} module={module} />
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  )
} 