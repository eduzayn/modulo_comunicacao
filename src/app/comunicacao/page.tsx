/**
 * page.tsx - Página inicial da área de comunicação
 * 
 * Esta página fornece uma visão geral das principais funcionalidades
 * do módulo de comunicação e serve como ponto de entrada principal.
 */

import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare, Users, BarChart, Settings, Bell, Send, Calendar, Clock } from 'lucide-react';
import { allCommunicationRoutes } from './routes';

export const metadata: Metadata = {
  title: 'Painel de Comunicação',
  description: 'Visão geral do módulo de comunicação e suas funcionalidades',
};

// Cartões de atalho para as principais funcionalidades
const featureCards = [
  {
    title: 'Mensagens',
    description: 'Gerencie mensagens enviadas e recebidas',
    icon: <MessageSquare className="h-6 w-6" />,
    href: '/communication/messages',
    color: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Contatos',
    description: 'Acesse e gerencie seus contatos',
    icon: <Users className="h-6 w-6" />,
    href: '/communication/contacts',
    color: 'bg-green-50 dark:bg-green-950',
    iconColor: 'text-green-500',
  },
  {
    title: 'Estatísticas',
    description: 'Visualize estatísticas de comunicação',
    icon: <BarChart className="h-6 w-6" />,
    href: '/communication/stats',
    color: 'bg-purple-50 dark:bg-purple-950',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Configurações',
    description: 'Configure o módulo de comunicação',
    icon: <Settings className="h-6 w-6" />,
    href: '/communication/settings',
    color: 'bg-amber-50 dark:bg-amber-950',
    iconColor: 'text-amber-500',
  },
];

// Ações rápidas
const quickActions = [
  {
    title: 'Nova Mensagem',
    icon: <Send className="h-4 w-4" />,
    href: '/communication/messages/new',
  },
  {
    title: 'Novo Contato',
    icon: <Users className="h-4 w-4" />,
    href: '/communication/contacts/new',
  },
  {
    title: 'Agendar Comunicação',
    icon: <Calendar className="h-4 w-4" />,
    href: '/communication/calendar/schedule',
  },
  {
    title: 'Relógio de Ponto',
    icon: <Clock className="h-4 w-4" />,
    href: '/communication/time-tracking',
  },
];

export default function CommunicationDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Painel de Comunicação</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao módulo de comunicação. Gerencie todas as suas interações com eficiência.
        </p>
      </div>

      {/* Ações rápidas */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Button 
            key={action.href} 
            variant="outline" 
            size="sm" 
            asChild
            className="h-9"
          >
            <Link href={action.href}>
              {action.icon}
              <span className="ml-2">{action.title}</span>
            </Link>
          </Button>
        ))}
      </div>

      {/* Principais recursos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featureCards.map((card) => (
          <Card key={card.href} className="overflow-hidden">
            <CardHeader className={`p-4 ${card.color}`}>
              <div className="flex items-center gap-2">
                <div className={`rounded-full p-2 ${card.iconColor} bg-white dark:bg-slate-950`}>
                  {card.icon}
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-sm">{card.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              <Button variant="ghost" size="sm" asChild>
                <Link href={card.href}>Acessar</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Visão geral das atividades */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividade Recente</CardTitle>
            <CardDescription>
              Seu histórico de atividades e comunicações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Nenhuma atividade recente para exibir.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Ver todas as atividades
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notificações</CardTitle>
            <CardDescription>
              Suas notificações pendentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <p>Você não tem notificações pendentes</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Configurar notificações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 