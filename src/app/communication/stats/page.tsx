'use client'

import { useState, useEffect } from 'react'
import { BaseLayout } from '@/components/layout/BaseLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SelectField } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Download, RefreshCw } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function StatsPage() {
  const [period, setPeriod] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalMessages: 1234,
    activeChats: 45,
    averageResponseTime: '2.5min',
    satisfactionRate: '98%'
  })

  const [chartData, setChartData] = useState([
    { date: '2024-01-01', messages: 120, conversations: 45 },
    { date: '2024-01-02', messages: 145, conversations: 52 },
    { date: '2024-01-03', messages: 132, conversations: 48 },
    { date: '2024-01-04', messages: 167, conversations: 55 },
    { date: '2024-01-05', messages: 189, conversations: 60 },
    { date: '2024-01-06', messages: 156, conversations: 50 },
    { date: '2024-01-07', messages: 178, conversations: 58 },
  ])

  useEffect(() => {
    // Simula atualização em tempo real
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 5),
        activeChats: Math.max(0, prev.activeChats + Math.floor(Math.random() * 3) - 1)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleExport = async () => {
    setIsLoading(true)
    try {
      // Prepara os dados para exportação
      const workbook = XLSX.utils.book_new()
      
      // Adiciona aba de métricas
      const metricsData = [
        ['Métrica', 'Valor'],
        ['Total de Mensagens', stats.totalMessages],
        ['Chats Ativos', stats.activeChats],
        ['Tempo Médio de Resposta', stats.averageResponseTime],
        ['Taxa de Satisfação', stats.satisfactionRate]
      ]
      const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData)
      XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Métricas')

      // Adiciona aba de dados do gráfico
      const chartSheet = XLSX.utils.json_to_sheet(chartData)
      XLSX.utils.book_append_sheet(workbook, chartSheet, 'Dados do Gráfico')

      // Gera o arquivo
      XLSX.writeFile(workbook, 'relatorio-estatisticas.xlsx')
    } catch (error) {
      console.error('Erro ao exportar relatório:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simula atualização dos dados
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Atualiza as métricas
      setStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 10),
        activeChats: Math.max(0, prev.activeChats + Math.floor(Math.random() * 5) - 2),
        averageResponseTime: `${(2 + Math.random()).toFixed(1)}min`,
        satisfactionRate: `${Math.min(100, 95 + Math.floor(Math.random() * 5))}%`
      }))

      // Atualiza os dados do gráfico
      const lastDate = new Date(chartData[chartData.length - 1].date)
      const newDate = new Date(lastDate)
      newDate.setDate(newDate.getDate() + 1)

      setChartData(prev => [
        ...prev.slice(1),
        {
          date: newDate.toISOString().split('T')[0],
          messages: Math.floor(Math.random() * 100) + 100,
          conversations: Math.floor(Math.random() * 30) + 30
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BaseLayout module="communication">
      <div className="space-y-4" data-testid="stats-dashboard">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Estatísticas</h2>
            <p className="text-muted-foreground">
              Acompanhe as métricas do sistema de comunicação
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={handleExport} 
              disabled={isLoading}
              className="flex-1 sm:flex-none"
              data-testid="export-button"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              disabled={isLoading}
              className="flex-1 sm:flex-none"
              data-testid="refresh-button"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" 
          data-testid="stats-cards"
        >
          <Card className="p-4" data-testid="total-messages">
            <h3 className="font-medium text-muted-foreground">Total de Mensagens</h3>
            <p className="text-2xl font-bold">{stats.totalMessages}</p>
          </Card>
          <Card className="p-4" data-testid="active-conversations">
            <h3 className="font-medium text-muted-foreground">Chats Ativos</h3>
            <p className="text-2xl font-bold">{stats.activeChats}</p>
          </Card>
          <Card className="p-4" data-testid="response-time">
            <h3 className="font-medium text-muted-foreground">Tempo Médio de Resposta</h3>
            <p className="text-2xl font-bold">{stats.averageResponseTime}</p>
          </Card>
          <Card className="p-4" data-testid="satisfaction-rate">
            <h3 className="font-medium text-muted-foreground">Taxa de Satisfação</h3>
            <p className="text-2xl font-bold">{stats.satisfactionRate}</p>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <SelectField
              value={period}
              onValueChange={setPeriod}
              data-testid="period-filter"
              options={[
                { value: '7d', label: 'Últimos 7 dias' },
                { value: '30d', label: 'Últimos 30 dias' },
                { value: '90d', label: 'Últimos 90 dias' },
              ]}
              placeholder="Filtrar período"
              className="w-full sm:w-48"
            />
            <div className="flex gap-4 flex-1">
              <DatePicker
                placeholder="Data inicial"
                onChange={() => {}}
                className="w-full sm:w-48"
              />
              <DatePicker
                placeholder="Data final"
                onChange={() => {}}
                className="w-full sm:w-48"
              />
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center py-8" data-testid="stats-loading">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          <div className="h-[400px]" data-testid="stats-charts">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="messages"
                  name="Mensagens"
                  stroke="#2563eb"
                  strokeWidth={2}
                  data-testid="messages-chart"
                />
                <Line
                  type="monotone"
                  dataKey="conversations"
                  name="Conversas"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </BaseLayout>
  )
} 