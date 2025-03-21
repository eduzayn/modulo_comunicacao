'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Tag, Clock, Briefcase, Settings, Bot, Workflow, ListFilter, BookOpen, LayoutDashboard, MessageCircle, CreditCard, Plug, Database, Inbox, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  
  const settingsCategories = [
    {
      title: 'Conta',
      description: 'Gerenciar configurações da conta e perfil',
      icon: <Settings className="h-8 w-8 text-primary" />,
      href: '/settings/account',
    },
    {
      title: 'Equipes',
      description: 'Gerenciar equipes e permissões de usuários',
      icon: <Users className="h-8 w-8 text-primary" />,
      href: '/settings/groups',
    },
    {
      title: 'Canais',
      description: 'Configurar canais de comunicação',
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      href: '/settings/channels',
    },
    {
      title: 'Caixa de Entrada',
      description: 'Configurar a caixa de entrada unificada',
      icon: <Inbox className="h-8 w-8 text-primary" />,
      href: '/settings/inbox',
      featured: true,
    },
    {
      title: 'CRM',
      description: 'Configurar pipelines e processos de vendas',
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      href: '/settings/crm',
      featured: true,
    },
    {
      title: 'Relatórios',
      description: 'Configurar painéis e métricas de relatórios',
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      href: '/settings/reports',
      featured: true,
    },
    {
      title: 'Integrações',
      description: 'Gerenciar integrações e APIs',
      icon: <Plug className="h-8 w-8 text-primary" />,
      href: '/settings/integrations',
    },
    {
      title: 'Bots',
      description: 'Configurar assistentes virtuais',
      icon: <Bot className="h-8 w-8 text-primary" />,
      href: '/settings/bots',
    },
    {
      title: 'Widget',
      description: 'Personalizar o widget de atendimento',
      icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
      href: '/settings/widget',
    },
    {
      title: 'Campos Personalizados',
      description: 'Gerenciar campos personalizados',
      icon: <Database className="h-8 w-8 text-primary" />,
      href: '/settings/custom-fields',
    },
    {
      title: 'Frases Rápidas',
      description: 'Criar e gerenciar frases rápidas',
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      href: '/settings/quick-phrases',
    },
    {
      title: 'Tags',
      description: 'Gerenciar etiquetas para conversas',
      icon: <Tag className="h-8 w-8 text-primary" />,
      href: '/settings/tags',
    },
    {
      title: 'Horários',
      description: 'Definir horários de atendimento',
      icon: <Clock className="h-8 w-8 text-primary" />,
      href: '/settings/business-hours',
    },
    {
      title: 'Base de Conhecimento',
      description: 'Gerenciar artigos e tutoriais',
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      href: '/settings/knowledge-base',
    },
    {
      title: 'Regras de Atribuição',
      description: 'Configurar regras para atribuição de conversas',
      icon: <ListFilter className="h-8 w-8 text-primary" />,
      href: '/settings/assignment-rules',
    },
    {
      title: 'Automações',
      description: 'Criar e gerenciar automações',
      icon: <Workflow className="h-8 w-8 text-primary" />,
      href: '/settings/automations',
    },
    {
      title: 'Faturamento',
      description: 'Gerenciar assinaturas e pagamentos',
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      href: '/settings/billing',
    },
  ];

  // Filtrar categorias destacadas
  const featuredCategories = settingsCategories.filter(category => category.featured);
  const regularCategories = settingsCategories.filter(category => !category.featured);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      {featuredCategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Configurações em destaque</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((category) => (
              <Card key={category.href} className="border hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{category.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href={category.href} className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                    >
                      Configurar
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Todas as configurações</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {regularCategories.map((category) => (
            <Card key={category.href} className="border hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {category.icon}
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{category.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Link href={category.href} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                  >
                    Configurar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
