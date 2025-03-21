import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Clock, Download, Filter, Plus, Search, ChevronLeft, ChevronRight, Users } from 'lucide-react';

export const metadata = {
  title: 'Agenda | Sistema de Comunicação',
  description: 'Gerencie eventos e compromissos da equipe',
};

// Dados simulados de eventos
const eventos = [
  {
    id: 1,
    titulo: 'Reunião de Planejamento',
    data: '2023-03-16',
    horario: '09:00 - 10:30',
    local: 'Sala de Reuniões 2',
    tipo: 'Reunião',
    participantes: [
      { id: 1, nome: 'Ana Silva', avatar: '/avatars/ana.jpg' },
      { id: 2, nome: 'Carlos Mendes', avatar: null },
      { id: 3, nome: 'Juliana Costa', avatar: '/avatars/juliana.jpg' },
    ],
    descricao: 'Planejamento estratégico do trimestre para o módulo de comunicação',
  },
  {
    id: 2,
    titulo: 'Treinamento de Novos Recursos',
    data: '2023-03-17',
    horario: '13:00 - 15:00',
    local: 'Auditório',
    tipo: 'Treinamento',
    participantes: [
      { id: 1, nome: 'Ana Silva', avatar: '/avatars/ana.jpg' },
      { id: 4, nome: 'Roberto Alves', avatar: null },
      { id: 5, nome: 'Mariana Santos', avatar: '/avatars/mariana.jpg' },
    ],
    descricao: 'Apresentação e treinamento sobre novos recursos do sistema de comunicação',
  },
  {
    id: 3,
    titulo: 'Revisão de Sprint',
    data: '2023-03-18',
    horario: '14:00 - 15:00',
    local: 'Sala de Reuniões 1',
    tipo: 'Reunião',
    participantes: [
      { id: 2, nome: 'Carlos Mendes', avatar: null },
      { id: 3, nome: 'Juliana Costa', avatar: '/avatars/juliana.jpg' },
      { id: 4, nome: 'Roberto Alves', avatar: null },
    ],
    descricao: 'Revisão dos resultados da sprint atual e planejamento da próxima',
  },
  {
    id: 4,
    titulo: 'Lançamento de Nova Versão',
    data: '2023-03-20',
    horario: '10:00 - 11:30',
    local: 'Online - Teams',
    tipo: 'Evento',
    participantes: [
      { id: 1, nome: 'Ana Silva', avatar: '/avatars/ana.jpg' },
      { id: 2, nome: 'Carlos Mendes', avatar: null },
      { id: 3, nome: 'Juliana Costa', avatar: '/avatars/juliana.jpg' },
      { id: 4, nome: 'Roberto Alves', avatar: null },
      { id: 5, nome: 'Mariana Santos', avatar: '/avatars/mariana.jpg' },
    ],
    descricao: 'Apresentação oficial da nova versão do sistema para todos os clientes e parceiros',
  },
];

// Eventos agrupados por dia
const eventosDia = [
  {
    data: '2023-03-16',
    eventos: [
      {
        id: 1,
        titulo: 'Reunião de Planejamento',
        horario: '09:00 - 10:30',
        tipo: 'Reunião',
        participantes: 3,
      },
      {
        id: 5,
        titulo: 'Call com Cliente XYZ',
        horario: '14:00 - 15:00',
        tipo: 'Reunião',
        participantes: 2,
      },
    ],
  },
  {
    data: '2023-03-17',
    eventos: [
      {
        id: 2,
        titulo: 'Treinamento de Novos Recursos',
        horario: '13:00 - 15:00',
        tipo: 'Treinamento',
        participantes: 3,
      },
    ],
  },
  {
    data: '2023-03-18',
    eventos: [
      {
        id: 3,
        titulo: 'Revisão de Sprint',
        horario: '14:00 - 15:00',
        tipo: 'Reunião',
        participantes: 3,
      },
    ],
  },
  {
    data: '2023-03-20',
    eventos: [
      {
        id: 4,
        titulo: 'Lançamento de Nova Versão',
        horario: '10:00 - 11:30',
        tipo: 'Evento',
        participantes: 5,
      },
    ],
  },
];

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
        <p className="text-muted-foreground">
          Gerencie eventos e compromissos da equipe
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filtrar</span>
          </Button>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos..."
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
            <span>Novo Evento</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="lista" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full max-w-xs">
              <TabsTrigger value="lista">Lista</TabsTrigger>
              <TabsTrigger value="calendario">Calendário</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lista" className="space-y-4">
              {eventosDia.map((dia) => (
                <Card key={dia.data}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {new Date(dia.data).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dia.eventos.map((evento) => (
                      <div key={evento.id} className="flex items-center gap-4 border-l-4 border-primary pl-4 py-2">
                        <div className="flex-1">
                          <h3 className="font-medium">{evento.titulo}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{evento.horario}</span>
                            </div>
                            <div className="hidden sm:block">•</div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{evento.participantes} participantes</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          evento.tipo === 'Reunião' ? 'default' : 
                          evento.tipo === 'Treinamento' ? 'secondary' : 
                          'outline'
                        }>
                          {evento.tipo}
                        </Badge>
                        <Button variant="outline" size="sm">Ver</Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="calendario">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Março 2023</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3">
                    <Calendar 
                      mode="single"
                      className="rounded-md border"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>
                Eventos agendados para os próximos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventos.slice(0, 3).map((evento) => (
                <div key={evento.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium">{evento.titulo}</h3>
                  <div className="flex flex-col text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{new Date(evento.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{evento.horario}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Ver Todos os Eventos</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Participantes Frequentes</CardTitle>
              <CardDescription>
                Membros mais ativos em eventos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventos[0].participantes.map((participante) => (
                <div key={participante.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <div className="bg-muted h-full w-full rounded-full flex items-center justify-center">
                      {participante.avatar ? (
                        <img 
                          src={participante.avatar} 
                          alt={participante.nome} 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium">{participante.nome.charAt(0)}</span>
                      )}
                    </div>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{participante.nome}</h3>
                    <p className="text-xs text-muted-foreground">5 eventos este mês</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Detalhes do Evento</h2>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle>{eventos[0].titulo}</CardTitle>
                <CardDescription>
                  {eventos[0].tipo} • {new Date(eventos[0].data).toLocaleDateString('pt-BR')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Editar</Button>
                <Button size="sm">Adicionar ao Calendário</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Horário</p>
                  <p className="font-medium">{eventos[0].horario}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Local</p>
                  <p className="font-medium">{eventos[0].local}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Descrição</p>
                <p className="text-sm">{eventos[0].descricao}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-2">Participantes ({eventos[0].participantes.length})</p>
              <div className="flex flex-wrap gap-2">
                {eventos[0].participantes.map((participante) => (
                  <div key={participante.id} className="flex items-center gap-2 border rounded-full py-1 px-2">
                    <Avatar className="h-5 w-5">
                      <div className="bg-muted h-full w-full rounded-full flex items-center justify-center">
                        {participante.avatar ? (
                          <img 
                            src={participante.avatar} 
                            alt={participante.nome} 
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-medium">{participante.nome.charAt(0)}</span>
                        )}
                      </div>
                    </Avatar>
                    <span className="text-xs">{participante.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 