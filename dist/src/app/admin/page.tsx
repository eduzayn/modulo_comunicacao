/**
 * page.tsx - Página inicial da área administrativa
 * 
 * Dashboard administrativo com visão geral do sistema e acesso rápido
 * às principais funcionalidades administrativas.
 */

import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { 
  Users, 
  Settings, 
  BarChart, 
  Activity, 
  HardDrive, 
  Database,
  Clock,
  Info,
  AlertCircle,
  Shield,
  Code
} from 'lucide-react';
import { adminRoutes, settingsRoutes } from './routes';

export const metadata: Metadata = {
  title: 'Dashboard Administrativo',
  description: 'Painel de controle para administração do sistema',
};

// Cards de resumo para o dashboard
const summaryCards = [
  {
    title: 'Usuários Ativos',
    value: '247',
    description: 'Usuários ativos nos últimos 30 dias',
    change: '+12%',
    status: 'increase',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-blue-50 dark:bg-blue-900',
    href: '/admin/users'
  },
  {
    title: 'Uso de Armazenamento',
    value: '64.8GB',
    description: '500GB disponíveis',
    change: '13%',
    status: 'neutral',
    icon: <HardDrive className="h-5 w-5" />,
    color: 'bg-purple-50 dark:bg-purple-900',
    href: '/admin/system/storage'
  },
  {
    title: 'Tempo Médio de Sessão',
    value: '24 min',
    description: 'Tempo médio por usuário',
    change: '+5 min',
    status: 'increase',
    icon: <Clock className="h-5 w-5" />,
    color: 'bg-amber-50 dark:bg-amber-900',
    href: '/admin/reports/usage'
  },
  {
    title: 'Tamanho do Banco',
    value: '1.2GB',
    description: 'Crescimento: 50MB/semana',
    change: '-10%',
    status: 'decrease',
    icon: <Database className="h-5 w-5" />,
    color: 'bg-green-50 dark:bg-green-900',
    href: '/admin/system/database'
  }
];

// Alertas de sistema
const systemAlerts = [
  {
    title: 'Manutenção programada',
    description: 'Domingo, 20/10/2023 às 02:00',
    severity: 'info',
    icon: <Info className="h-4 w-4 text-blue-500" />,
  },
  {
    title: 'Uso de armazenamento acima de 85%',
    description: 'Considere limpar arquivos antigos',
    severity: 'warning',
    icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
  },
  {
    title: 'Certificado SSL expira em 30 dias',
    description: 'Renove o certificado antes de 15/11/2023',
    severity: 'error',
    icon: <Shield className="h-4 w-4 text-red-500" />,
  }
];

// Ações rápidas para administradores
const quickActions = [
  {
    title: 'Gerenciar Usuários',
    icon: <Users className="h-4 w-4" />,
    href: '/admin/users',
  },
  {
    title: 'Configurações',
    icon: <Settings className="h-4 w-4" />,
    href: '/admin/settings/general',
  },
  {
    title: 'Relatórios',
    icon: <BarChart className="h-4 w-4" />,
    href: '/admin/reports/dashboard',
  },
  {
    title: 'Status do Sistema',
    icon: <Activity className="h-4 w-4" />,
    href: '/admin/system/status',
  },
  {
    title: 'API & Integrações',
    icon: <Code className="h-4 w-4" />,
    href: '/admin/system/integrations',
  }
];

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral e gerenciamento do sistema
          </p>
        </div>
        
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
                <span className="ml-2 whitespace-nowrap">{action.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className={`p-4 ${card.color}`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{card.title}</CardTitle>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold">{card.value}</div>
                <CardDescription className="text-xs flex items-center justify-between">
                  {card.description}
                  <span 
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      card.status === 'increase' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                      card.status === 'decrease' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                    }`}
                  >
                    {card.change}
                  </span>
                </CardDescription>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href={card.href}>
                  <span>Ver detalhes</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Alertas e Relatórios */}
      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alertas do Sistema</CardTitle>
              <CardDescription>
                Notificações importantes que requerem atenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className={`mt-0.5 ${alert.severity === 'error' ? 'text-red-500' : alert.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'}`}>
                      {alert.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Ver todos os alertas
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Atividade Recente</CardTitle>
              <CardDescription>
                Monitoramento de atividades administrativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="users">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="users">Usuários</TabsTrigger>
                  <TabsTrigger value="system">Sistema</TabsTrigger>
                  <TabsTrigger value="security">Segurança</TabsTrigger>
                </TabsList>
                
                <TabsContent value="users" className="mt-4 space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>- Usuário <span className="font-medium">admin@sistema.com</span> atualizou configurações de perfil</p>
                    <p className="text-xs text-muted-foreground mt-1">Hoje, 14:32</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>- Novo usuário <span className="font-medium">joao.silva@empresa.com</span> registrado</p>
                    <p className="text-xs text-muted-foreground mt-1">Hoje, 11:05</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>- Usuário <span className="font-medium">carlos@sistema.com</span> removido</p>
                    <p className="text-xs text-muted-foreground mt-1">Ontem, 17:45</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="system" className="mt-4 space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>- Backup automático do banco de dados concluído</p>
                    <p className="text-xs text-muted-foreground mt-1">Hoje, 03:00</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>- Sistema atualizado para versão 2.4.1</p>
                    <p className="text-xs text-muted-foreground mt-1">Ontem, 22:15</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="mt-4 space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>- Tentativa de login malsucedida para conta <span className="font-medium">admin</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Hoje, 08:45</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>- Política de senhas atualizada para exigir 12 caracteres</p>
                    <p className="text-xs text-muted-foreground mt-1">15/10/2023</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Ver histórico completo
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 