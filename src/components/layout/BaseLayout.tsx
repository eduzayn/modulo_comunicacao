'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PageTransition } from './PageTransition'
import { MessageSquare, Users, BarChart2, Settings, Home, Book, GraduationCap, FileText, Library, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Breadcrumbs } from './Breadcrumbs'
import { BackButton } from './BackButton'

interface MenuItem {
  title: string
  href: string
  icon: React.ReactNode
}

interface BaseLayoutProps {
  children: ReactNode
  module: 'communication' | 'student' | 'content' | 'enrollment'
  items?: MenuItem[]
}

const moduleMenuItems: Record<'communication' | 'student' | 'content' | 'enrollment', MenuItem[]> = {
  communication: [
    { title: 'Início', href: '/communication', icon: <Home className="h-4 w-4" /> },
    { title: 'Chat', href: '/communication/chat', icon: <MessageSquare className="h-4 w-4" /> },
    { title: 'Contatos', href: '/communication/contacts', icon: <Users className="h-4 w-4" /> },
    { title: 'Estatísticas', href: '/communication/stats', icon: <BarChart2 className="h-4 w-4" /> },
    { title: 'Configurações', href: '/communication/settings', icon: <Settings className="h-4 w-4" /> }
  ],
  student: [
    { title: 'Início', href: '/student', icon: <Home className="h-4 w-4" /> },
    { title: 'Alunos', href: '/student/list', icon: <Users className="h-4 w-4" /> },
    { title: 'Matrículas', href: '/student/enrollments', icon: <GraduationCap className="h-4 w-4" /> },
    { title: 'Documentos', href: '/student/documents', icon: <FileText className="h-4 w-4" /> },
    { title: 'Configurações', href: '/student/settings', icon: <Settings className="h-4 w-4" /> }
  ],
  content: [
    { title: 'Início', href: '/content', icon: <Home className="h-4 w-4" /> },
    { title: 'Materiais', href: '/content/materials', icon: <Book className="h-4 w-4" /> },
    { title: 'Cursos', href: '/content/courses', icon: <GraduationCap className="h-4 w-4" /> },
    { title: 'Biblioteca', href: '/content/library', icon: <Library className="h-4 w-4" /> },
    { title: 'Configurações', href: '/content/settings', icon: <Settings className="h-4 w-4" /> }
  ],
  enrollment: [
    { title: 'Início', href: '/enrollment', icon: <Home className="h-4 w-4" /> },
    { title: 'Matrículas', href: '/enrollment/list', icon: <GraduationCap className="h-4 w-4" /> },
    { title: 'Documentos', href: '/enrollment/documents', icon: <FileText className="h-4 w-4" /> },
    { title: 'Pagamentos', href: '/enrollment/payments', icon: <CreditCard className="h-4 w-4" /> },
    { title: 'Configurações', href: '/enrollment/settings', icon: <Settings className="h-4 w-4" /> }
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
    const matchingItem = menuItems.find(item => item.href === href)
    const title = matchingItem ? matchingItem.title : segment
    return { href, title }
  })

  // Verifica se não está na página inicial do módulo
  const showBackButton = pathname !== `/${module}`

  return (
    <div className="flex min-h-screen">
      <Sidebar module={module} items={menuItems} />
      <div className="flex-1">
        <Header />
        <main className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center gap-4">
            {showBackButton && <BackButton />}
            <Breadcrumbs items={breadcrumbItems} module={module} />
          </div>
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  )
} 