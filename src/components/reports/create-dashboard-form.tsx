'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckIcon, PlusCircleIcon, BarChart3, LineChart, PieChart, Network, Table2 } from 'lucide-react'

export function CreateDashboardForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dashboardType, setDashboardType] = useState('sales')
  const [chartType, setChartType] = useState('bar')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    // Aqui você adicionaria a lógica para salvar o dashboard
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="data">Fonte de Dados</TabsTrigger>
          <TabsTrigger value="visualization">Visualização</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Dashboard</CardTitle>
              <CardDescription>
                Configure as informações básicas do seu dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Dashboard</Label>
                <Input id="name" placeholder="Ex: Relatório de Vendas Mensal" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o propósito deste dashboard"
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Dashboard</Label>
                <Select value={dashboardType} onValueChange={setDashboardType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Vendas</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operações</SelectItem>
                    <SelectItem value="finance">Finanças</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Fonte de Dados</CardTitle>
              <CardDescription>
                Selecione e configure as fontes de dados para o seu dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-source">Fonte Principal</Label>
                <Select defaultValue="crm">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fonte de dados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crm">Sistema CRM</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="database">Banco de Dados</SelectItem>
                    <SelectItem value="spreadsheet">Planilha</SelectItem>
                    <SelectItem value="api">API Externa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-range">Período</Label>
                <Select defaultValue="last-30">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7">Últimos 7 dias</SelectItem>
                    <SelectItem value="last-30">Últimos 30 dias</SelectItem>
                    <SelectItem value="last-90">Últimos 90 dias</SelectItem>
                    <SelectItem value="ytd">Ano atual</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refresh-rate">Taxa de Atualização</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Tempo real</SelectItem>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                    <SelectItem value="monthly">Mensalmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>Visualização</CardTitle>
              <CardDescription>
                Escolha como os dados serão apresentados visualmente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Tipo de Gráfico Principal</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
                  <Button
                    type="button"
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart3 className="h-8 w-8" />
                    <span className="text-xs">Barras</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => setChartType('line')}
                  >
                    <LineChart className="h-8 w-8" />
                    <span className="text-xs">Linha</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={chartType === 'pie' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => setChartType('pie')}
                  >
                    <PieChart className="h-8 w-8" />
                    <span className="text-xs">Pizza</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={chartType === 'table' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => setChartType('table')}
                  >
                    <Table2 className="h-8 w-8" />
                    <span className="text-xs">Tabela</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={chartType === 'network' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => setChartType('network')}
                  >
                    <Network className="h-8 w-8" />
                    <span className="text-xs">Rede</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color-scheme">Esquema de Cores</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um esquema de cores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">Padrão do Sistema</SelectItem>
                    <SelectItem value="primary">Tons da Marca</SelectItem>
                    <SelectItem value="pastel">Tons Pastéis</SelectItem>
                    <SelectItem value="vivid">Cores Vivas</SelectItem>
                    <SelectItem value="monochrome">Monocromático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-6">
        <CardFooter className="flex justify-between pt-6">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" className="gap-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Criando dashboard...</>
            ) : (
              <>
                <PlusCircleIcon className="h-4 w-4" />
                Criar Dashboard
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
} 