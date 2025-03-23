'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { CalendarDays, List, Plus } from 'lucide-react'

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [tabValue, setTabValue] = useState<string>('calendar')

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Calendário</h1>
        
        <div className="flex items-center gap-4">
          <Select value={view} onValueChange={(value: 'month' | 'week' | 'day') => setView(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Visualização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="day">Dia</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs value={tabValue} onValueChange={setTabValue} className="w-[200px]">
            <TabsList>
              <TabsTrigger value="calendar">
                <CalendarDays className="h-4 w-4 mr-2" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
                Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
            />
          </CardContent>
        </Card>
        
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Visualize seus próximos eventos agendados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventos.map((evento, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="min-w-[40px] text-center">
                      <div className="font-bold">{evento.dia}</div>
                      <div className="text-xs text-muted-foreground">{evento.mes}</div>
                    </div>
                    <div>
                      <h4 className="font-medium">{evento.titulo}</h4>
                      <p className="text-sm text-muted-foreground">
                        {evento.horario} • {evento.local}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Refine sua visualização</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filtros.map((filtro, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${filtro.cor}-500`}></div>
                    <span>{filtro.nome}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Dados estáticos
const eventos = [
  { 
    dia: '15', 
    mes: 'Mar', 
    titulo: 'Reunião com Cliente ABC', 
    horario: '09:00 - 10:30', 
    local: 'Sala Virtual' 
  },
  { 
    dia: '16', 
    mes: 'Mar', 
    titulo: 'Apresentação de Produto', 
    horario: '14:00 - 15:00', 
    local: 'Sala de Conferências' 
  },
  { 
    dia: '18', 
    mes: 'Mar', 
    titulo: 'Treinamento da Equipe', 
    horario: '10:00 - 12:00', 
    local: 'Sala de Treinamento' 
  },
]

const filtros = [
  { nome: 'Reuniões', cor: 'blue' },
  { nome: 'Tarefas', cor: 'green' },
  { nome: 'Compromissos Externos', cor: 'purple' },
  { nome: 'Pessoal', cor: 'yellow' },
] 