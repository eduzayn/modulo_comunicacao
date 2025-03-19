'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PageTransition } from './PageTransition'
import { MessageSquare, Users, BarChart2, Settings, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface MenuItem {
  name: string
  href: string
  icon: any // Temporariamente usando 'any' para os ícones
}

interface BaseLayoutProps {
  children: ReactNode
  module: 'communication'
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

export function BaseLayout({ children, module }: BaseLayoutProps) {
  const pathname = usePathname()
  const menuItems = moduleMenuItems[module]

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-card border-r">
        <div className="p-6">
          <motion.h1 
            className="text-2xl font-bold text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Sistema
          </motion.h1>
        </div>
        <nav className="px-4">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.href}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={menuVariants}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200',
                  pathname === item.href && 'bg-accent text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="container py-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  )
} 