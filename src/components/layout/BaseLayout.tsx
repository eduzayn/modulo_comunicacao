'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PageTransition } from './PageTransition'
import { MessageSquare, Users, BarChart2, Settings, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { Sidebar } from './sidebar'
import { Breadcrumbs } from './Breadcrumbs'

interface MenuItem {
  name: string
  href: string
  icon: any // Temporariamente usando 'any' para os ícones
}

interface BaseLayoutProps {
  children: ReactNode
  module: 'communication' | 'student' | 'content' | 'enrollment'
  items: {
    title: string
    href: string
    icon: React.ReactNode
  }[]
}

const moduleMenuItems: Record<'communication', MenuItem[]> = {
  communication: [
    { name: 'Início', href: '/communication', icon: Home },
    { name: 'Chat', href: '/communication/chat', icon: MessageSquare },
    { name: 'Contatos', href: '/communication/contacts', icon: Users },
    { name: 'Estatísticas', href: '/communication/stats', icon: BarChart2 },
    { name: 'Configurações', href: '/communication/settings', icon: Settings }
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

export function BaseLayout({ children, module, items }: BaseLayoutProps) {
  const pathname = usePathname()
  const menuItems = moduleMenuItems[module]
  
  // Gera os itens do breadcrumb baseado no pathname atual
  const breadcrumbItems = pathname.split('/').filter(Boolean).map((segment, index, array) => {
    const href = '/' + array.slice(0, index + 1).join('/')
    const title = items.find(item => item.href === href)?.title || segment
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