'use client';

import { useTemplates } from '@/hooks/use-templates';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function TemplatesPage() {
  const { templates, isLoading, error } = useTemplates();
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando templates...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar templates</div>;
  }
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Templates de Mensagem</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crie e gerencie templates para mensagens automáticas e campanhas.
          </p>
        </div>
        <Link href="/templates/new" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Novo Template
        </Link>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
              <p className="mt-1 text-sm text-gray-500">Categoria: {template.category || 'Sem categoria'}</p>
              
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-sm font-medium">Canal: </span>
                  <span>{template.channelType}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Status: </span>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    template.status === 'active' ? 'bg-green-100 text-green-800' : 
                    template.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {template.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">Versão: </span>
                  <span>{template.version}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Link 
                  href={`/templates/${template.id}`}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Editar
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
