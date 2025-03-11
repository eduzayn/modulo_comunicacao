'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare, Users, BarChart2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Painel Principal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Conversas Ativas</h2>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-sm text-gray-500 mt-1">2 novas hoje</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Contatos</h2>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">128</p>
          <p className="text-sm text-gray-500 mt-1">5 novos esta semana</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Taxa de Resposta</h2>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">98%</p>
          <p className="text-sm text-gray-500 mt-1">+2% em relação ao mês anterior</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Conversas Recentes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold">
                    {i === 1 ? 'M' : i === 2 ? 'J' : 'C'}
                  </div>
                  <div>
                    <p className="font-medium">{i === 1 ? 'Maria Silva' : i === 2 ? 'João Santos' : 'Carlos Oliveira'}</p>
                    <p className="text-sm text-gray-500">Última mensagem: {i === 1 ? '5 min atrás' : i === 2 ? '1 hora atrás' : 'ontem'}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/chat-test">Ver</Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/chat-test">Ver todas as conversas</Link>
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
          <div className="space-y-3">
            {[
              { text: 'Nova mensagem recebida de Maria Silva', time: '5 min atrás' },
              { text: 'João Santos visualizou sua mensagem', time: '1 hora atrás' },
              { text: 'Você enviou um documento para Carlos Oliveira', time: 'ontem' },
              { text: 'Nova conversa iniciada com Ana Pereira', time: 'ontem' },
              { text: 'Mensagem marcada como resolvida', time: '2 dias atrás' }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 border-b pb-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              Ver todas as atividades
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
