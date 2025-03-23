import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Download, Filter, Plus, Search } from 'lucide-react';

export const metadata = {
  title: 'Registro de Horas | Sistema de Comunicação',
  description: 'Gerencie e visualize o registro de horas trabalhadas',
};

// Dados simulados de registros de horas
const registrosHoras = [
  {
    id: 1,
    usuario: {
      nome: 'Ana Silva',
      avatar: '/avatars/ana.jpg',
    },
    data: '2023-03-15',
    inicio: '08:00',
    fim: '12:00',
    total: '4h',
    projeto: 'Suporte ao Cliente',
    categoria: 'Atendimento',
    descricao: 'Atendimento de chamados de suporte técnico',
    status: 'Aprovado',
  },
  {
    id: 2,
    usuario: {
      nome: 'Carlos Mendes',
      avatar: null,
    },
    data: '2023-03-15',
    inicio: '13:00',
    fim: '17:30',
    total: '4h30min',
    projeto: 'Manutenção de Sistema',
    categoria: 'Desenvolvimento',
    descricao: 'Correção de bugs no módulo de mensagens',
    status: 'Pendente',
  },
  {
    id: 3,
    usuario: {
      nome: 'Juliana Costa',
      avatar: '/avatars/juliana.jpg',
    },
    data: '2023-03-14',
    inicio: '09:00',
    fim: '18:00',
    total: '8h',
    projeto: 'Implementação de Features',
    categoria: 'Desenvolvimento',
    descricao: 'Desenvolvimento de novas funcionalidades para o módulo de relatórios',
    status: 'Aprovado',
  },
  {
    id: 4,
    usuario: {
      nome: 'Roberto Alves',
      avatar: null,
    },
    data: '2023-03-14',
    inicio: '08:30',
    fim: '17:30',
    total: '8h',
    projeto: 'Treinamento',
    categoria: 'Capacitação',
    descricao: 'Treinamento da equipe de suporte sobre novas funcionalidades',
    status: 'Aprovado',
  },
];

// Dados simulados de projetos
const projetos = [
  { id: 1, nome: 'Suporte ao Cliente', horas: '152h', progresso: 65 },
  { id: 2, nome: 'Manutenção de Sistema', horas: '98h', progresso: 42 },
  { id: 3, nome: 'Implementação de Features', horas: '210h', progresso: 78 },
  { id: 4, nome: 'Treinamento', horas: '45h', progresso: 100 },
];

export default function HoursPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Registro de Horas</h1>
        <p className="text-muted-foreground">
          Gerencie e acompanhe o registro de horas trabalhadas
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Filtrar por Período</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Mais Filtros</span>
          </Button>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar registros..."
              className="pl-8 w-full md:w-60"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
          
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Novo Registro</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total de Horas</CardTitle>
            <CardDescription>Este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">148h</div>
            <p className="text-xs text-muted-foreground">
              +12h em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Média Diária</CardTitle>
            <CardDescription>Por usuário ativo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7.5h</div>
            <p className="text-xs text-muted-foreground">
              -0.2h em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Registros Pendentes</CardTitle>
            <CardDescription>Aguardando aprovação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +3 em relação à semana anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Próximo Fechamento</CardTitle>
            <CardDescription>Ciclo mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5 dias</div>
            <p className="text-xs text-muted-foreground">
              Último dia para registros: 20/03/2023
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="registros" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registros">Registros Recentes</TabsTrigger>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registros" className="space-y-4">
          {registrosHoras.map((registro) => (
            <Card key={registro.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <div className="bg-muted h-full w-full rounded-full flex items-center justify-center">
                        {registro.usuario.avatar ? (
                          <img 
                            src={registro.usuario.avatar} 
                            alt={registro.usuario.nome} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-medium">{registro.usuario.nome.charAt(0)}</span>
                        )}
                      </div>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{registro.usuario.nome}</h3>
                      <p className="text-sm text-muted-foreground">{registro.projeto}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Data</p>
                      <p className="text-sm">
                        {new Date(registro.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Período</p>
                      <p className="text-sm">{registro.inicio} - {registro.fim}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-sm font-medium">{registro.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Categoria</p>
                      <p className="text-sm">{registro.categoria}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge 
                        variant={registro.status === 'Aprovado' ? 'default' : 'secondary'}
                      >
                        {registro.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Ver</Button>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                </div>
                
                {registro.descricao && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-xs text-muted-foreground mb-1">Descrição</p>
                    <p className="text-sm">{registro.descricao}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-center">
            <Button variant="outline">Carregar mais registros</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="projetos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projetos.map((projeto) => (
              <Card key={projeto.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{projeto.nome}</CardTitle>
                    <Badge>{projeto.horas}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Progresso</span>
                      <span className="text-sm font-medium">{projeto.progresso}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${projeto.progresso}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                  <Button size="sm">Registrar Horas</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button>Adicionar Novo Projeto</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="relatorios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Horas</CardTitle>
              <CardDescription>
                Gere relatórios detalhados de horas registradas
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Relatório por Usuário</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Visualize as horas registradas por cada usuário em um período específico
                </p>
                <Button>Gerar Relatório</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Relatório por Projeto</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Analise o tempo dedicado a cada projeto e sua evolução ao longo do tempo
                </p>
                <Button>Gerar Relatório</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 