import Link from 'next/link';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function CommunicationDashboard() {
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
    {
      title: 'Automação',
      description: 'Configure fluxos automatizados de comunicação baseados em eventos.',
      href: '/automation',
    },
    {
      title: 'Relatórios',
      description: 'Visualize métricas e relatórios sobre a comunicação na plataforma.',
      href: '/reports',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-semibold text-gray-900">Módulo de Comunicação</h1>
      <p className="mt-1 text-sm text-gray-500">
        Gerencie todos os canais de comunicação, conversas, templates e configurações de IA.
      </p>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.href} className="overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{module.description}</p>
              <div className="mt-4">
                <Link 
                  href={module.href}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Acessar {module.title}
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
