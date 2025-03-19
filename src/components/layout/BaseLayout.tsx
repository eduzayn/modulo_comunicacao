'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { 
  MessageSquare, 
  Users, 
  Settings, 
  HelpCircle, 
  Home, 
  BarChart2,
  BookOpen,
  GraduationCap,
  Trophy,
  Clock,
  FileText,
  Video,
  Image,
  DollarSign,
  CalendarCheck,
  TrendingUp
} from 'lucide-react'

interface BaseLayoutProps {
  children: ReactNode
  module: 'communication' | 'student' | 'content' | 'enrollment'
}

const moduleConfig = {
  communication: {
    title: 'Módulo de Comunicação',
    items: [
      {
        title: 'Início',
        href: '/communication',
        icon: <Home className="h-5 w-5" />
      },
      {
        title: 'Chat',
        href: '/communication/chat',
        icon: <MessageSquare className="h-5 w-5" />
      },
      {
        title: 'Contatos',
        href: '/communication/contacts',
        icon: <Users className="h-5 w-5" />
      },
      {
        title: 'Estatísticas',
        href: '/communication/stats',
        icon: <BarChart2 className="h-5 w-5" />
      },
      {
        title: 'Configurações',
        href: '/communication/settings',
        icon: <Settings className="h-5 w-5" />
      },
      {
        title: 'Ajuda',
        href: '/communication/help',
        icon: <HelpCircle className="h-5 w-5" />
      }
    ]
  },
  student: {
    title: 'Portal do Aluno',
    items: [
      {
        title: 'Início',
        href: '/student',
        icon: <Home className="h-5 w-5" />
      },
      {
        title: 'Meus Cursos',
        href: '/student/courses',
        icon: <BookOpen className="h-5 w-5" />
      },
      {
        title: 'Progresso',
        href: '/student/progress',
        icon: <GraduationCap className="h-5 w-5" />
      },
      {
        title: 'Certificados',
        href: '/student/certificates',
        icon: <Trophy className="h-5 w-5" />
      },
      {
        title: 'Agenda',
        href: '/student/schedule',
        icon: <Clock className="h-5 w-5" />
      },
      {
        title: 'Ajuda',
        href: '/student/help',
        icon: <HelpCircle className="h-5 w-5" />
      }
    ]
  },
  content: {
    title: 'Módulo de Conteúdo',
    items: [
      {
        title: 'Início',
        href: '/content',
        icon: <Home className="h-5 w-5" />
      },
      {
        title: 'Materiais',
        href: '/content/materials',
        icon: <FileText className="h-5 w-5" />
      },
      {
        title: 'Vídeo Aulas',
        href: '/content/videos',
        icon: <Video className="h-5 w-5" />
      },
      {
        title: 'Recursos',
        href: '/content/resources',
        icon: <Image className="h-5 w-5" />
      },
      {
        title: 'Estatísticas',
        href: '/content/stats',
        icon: <BarChart2 className="h-5 w-5" />
      },
      {
        title: 'Configurações',
        href: '/content/settings',
        icon: <Settings className="h-5 w-5" />
      }
    ]
  },
  enrollment: {
    title: 'Módulo de Matrículas',
    items: [
      {
        title: 'Início',
        href: '/enrollment',
        icon: <Home className="h-5 w-5" />
      },
      {
        title: 'Alunos',
        href: '/enrollment/students',
        icon: <Users className="h-5 w-5" />
      },
      {
        title: 'Financeiro',
        href: '/enrollment/financial',
        icon: <DollarSign className="h-5 w-5" />
      },
      {
        title: 'Matrículas',
        href: '/enrollment/registrations',
        icon: <CalendarCheck className="h-5 w-5" />
      },
      {
        title: 'Relatórios',
        href: '/enrollment/reports',
        icon: <TrendingUp className="h-5 w-5" />
      },
      {
        title: 'Configurações',
        href: '/enrollment/settings',
        icon: <Settings className="h-5 w-5" />
      }
    ]
  }
}

export function BaseLayout({ children, module }: BaseLayoutProps) {
  const config = moduleConfig[module]

  return (
    <div className="flex h-screen">
      <Sidebar module={module} items={config.items} />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  )
} 