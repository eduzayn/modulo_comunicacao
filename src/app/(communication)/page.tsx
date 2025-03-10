'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { StatsCard } from '../../components/dashboard/stats-card';
import { RecentActivity } from '../../components/dashboard/recent-activity';
import { ChannelStats } from '../../components/dashboard/channel-stats';
import { useChannels } from '../../hooks/use-channels';
import { useConversations } from '../../hooks/use-conversations';
import { useTemplates } from '../../hooks/use-templates';
import { MessageSquare, Users, FileText, Settings, BarChart } from 'lucide-react';

export default function CommunicationDashboard() {
  const { channels, isLoading: isLoadingChannels } = useChannels();
  const { conversations, isLoading: isLoadingConversations } = useConversations();
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  
  // Get all messages from all conversations
  const allMessages = conversations?.flatMap(conv => conv.messages || []) || [];
  
  // Sort messages by date (newest first)
  const recentMessages = [...allMessages].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Count active conversations
  const activeConversations = conversations?.filter(conv => conv.status === 'open')?.length || 0;
  
  // Count active templates
  const activeTemplates = templates?.filter(template => template.status === 'active')?.length || 0;
  
  const modules = [
    {
      title: 'Canais',
      description: 'Gerencie os canais de comunicação como WhatsApp, Email, Chat e SMS.',
      href: '/channels',
    },
    {
      title: 'Conversas',
      description: 'Visualize e gerencie todas as conversas com alunos, professores e parceiros.',
      href: '/conversations',
    },
    {
      title: 'Inteligência Artificial',
      description: 'Configure os modelos de IA para automação de respostas e análise de sentimento.',
      href: '/ai',
    },
    {
      title: 'Templates',
      description: 'Crie e gerencie templates para mensagens automáticas e campanhas.',
      href: '/templates',
    },
  ];
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Módulo de Comunicação</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral e estatísticas do sistema de comunicação
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <BarChart className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total de Canais" 
          value={isLoadingChannels ? '...' : channels?.length || 0}
          description="Canais de comunicação ativos"
          icon={<MessageSquare className="h-4 w-4" />}
          change={5}
          changeLabel="desde o mês passado"
        />
        
        <StatsCard 
          title="Conversas Ativas" 
          value={isLoadingConversations ? '...' : activeConversations}
          description="Conversas em andamento"
          icon={<Users className="h-4 w-4" />}
          change={12}
          changeLabel="desde a semana passada"
        />
        
        <StatsCard 
          title="Templates" 
          value={isLoadingTemplates ? '...' : activeTemplates}
          description="Templates ativos"
          icon={<FileText className="h-4 w-4" />}
        />
        
        <StatsCard 
          title="Mensagens" 
          value={allMessages.length}
          description="Total de mensagens"
          change={-3}
          changeLabel="desde ontem"
        />
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity messages={recentMessages} />
        </div>
        
        <div>
          <ChannelStats channels={channels || []} />
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <Card key={module.href} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={module.href}>
                <Button className="w-full">Acessar {module.title}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
