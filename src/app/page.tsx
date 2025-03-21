/**
 * page.tsx
 * 
 * Página inicial (dashboard) exibida na raiz da aplicação.
 * Fornece acesso rápido às principais áreas do sistema.
 */

import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageSquare, Users, BarChart3, Clock, Calendar, Settings } from 'lucide-react'
import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Dashboard - Sistema de Comunicação',
  description: 'Acesso rápido às principais funcionalidades do sistema de comunicação e gestão',
}

const areaCards = [
  {
    title: 'Comunicação',
    description: 'Chat, mensagens e gestão de contatos',
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    href: '/communication/messages',
    cta: 'Acessar comunicação',
    stats: {
      label: 'Mensagens hoje',
      value: '125'
    }
  },
  {
    title: 'Usuários',
    description: 'Gerenciamento de usuários e permissões',
    icon: <Users className="h-6 w-6 text-primary" />,
    href: '/admin/users',
    cta: 'Gerenciar usuários',
    stats: {
      label: 'Usuários ativos',
      value: '42'
    }
  },
  {
    title: 'Relatórios',
    description: 'Relatórios e estatísticas de uso',
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    href: '/admin/reports',
    cta: 'Ver relatórios',
    stats: {
      label: 'Dados desde',
      value: '30 dias'
    }
  },
  {
    title: 'Registro de Horas',
    description: 'Controle e registro de horas trabalhadas',
    icon: <Clock className="h-6 w-6 text-primary" />,
    href: '/admin/hours',
    cta: 'Registrar horas',
    stats: {
      label: 'Horas este mês',
      value: '148h'
    }
  },
  {
    title: 'Agenda',
    description: 'Calendário e agendamento de atividades',
    icon: <Calendar className="h-6 w-6 text-primary" />,
    href: '/admin/calendar',
    cta: 'Ver agenda',
    stats: {
      label: 'Próximos eventos',
      value: '8'
    }
  },
  {
    title: 'Configurações',
    description: 'Configurações do sistema e da conta',
    icon: <Settings className="h-6 w-6 text-primary" />,
    href: '/admin/settings',
    cta: 'Configurar',
    stats: {
      label: 'Última atualização',
      value: '2 dias'
    }
  }
]

// Componentes de Carregamento
function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(6).fill(0).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center py-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 pt-2">
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function TabContentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  )
}

// Componentes para Suspense
function MainAreaCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {areaCards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="rounded-full bg-primary/10 p-2">
              {card.icon}
            </div>
            <div>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">{card.stats.label}</span>
              <span className="font-medium">{card.stats.value}</span>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 pt-2">
            <Button asChild className="w-full">
              <Link href={card.href}>{card.cta}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>
          Suas últimas interações com o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Aqui serão exibidas suas atividades recentes no sistema.
        </p>
      </CardContent>
    </Card>
  )
}

function Favorites() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Favoritos</CardTitle>
        <CardDescription>
          Acesso rápido às suas áreas mais usadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Você ainda não adicionou nenhuma área aos favoritos.
        </p>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  return (
    <ProtectedPage>
      <main className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao Sistema</h1>
            <p className="text-muted-foreground">
              Acesse rapidamente todas as funcionalidades do sistema de comunicação e gestão
            </p>
          </div>

          <Tabs defaultValue="areas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="areas">Áreas Principais</TabsTrigger>
              <TabsTrigger value="recentes">Atividades Recentes</TabsTrigger>
              <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="areas" className="space-y-4">
              <Suspense fallback={<CardsSkeleton />}>
                <MainAreaCards />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="recentes">
              <Suspense fallback={<TabContentSkeleton />}>
                <RecentActivities />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="favoritos">
              <Suspense fallback={<TabContentSkeleton />}>
                <Favorites />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ProtectedPage>
  )
}
