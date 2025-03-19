'use client'

import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Home, BarChart } from 'lucide-react'
import { BaseLayout } from '@/components/layout/BaseLayout'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const menuItems = [
  {
    title: 'Início',
    href: '/communication',
    icon: <Home className="h-4 w-4" />
  },
  {
    title: 'Estatísticas',
    href: '/communication/stats',
    icon: <BarChart className="h-4 w-4" />
  }
]

const mockData = [
  { name: '01/01', messages: 400, chats: 300 },
  { name: '02/01', messages: 300, chats: 250 },
  { name: '03/01', messages: 200, chats: 150 },
  { name: '04/01', messages: 278, chats: 190 },
  { name: '05/01', messages: 189, chats: 140 },
  { name: '06/01', messages: 239, chats: 180 },
  { name: '07/01', messages: 349, chats: 250 }
]

export default function StatsPage() {
  const [dateRange, setDateRange] = useState<DateRange>()
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalMessages: 1955,
    activeChats: 1460,
    avgResponseTime: '2m 30s',
    satisfactionRate: '95%'
  })

  const handleDateRangeChange = async (range: DateRange | undefined) => {
    setDateRange(range)
    if (!range?.from || !range?.to) return

    setIsLoading(true)
    // Simula chamada à API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Atualiza estatísticas com dados simulados
    setStats({
      totalMessages: Math.floor(Math.random() * 2000) + 1000,
      activeChats: Math.floor(Math.random() * 1500) + 500,
      avgResponseTime: `${Math.floor(Math.random() * 5)}m ${Math.floor(Math.random() * 60)}s`,
      satisfactionRate: `${Math.floor(Math.random() * 10) + 90}%`
    })
    setIsLoading(false)
  }

  const handleExport = async () => {
    const data = {
      period: dateRange ? `${dateRange.from?.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}` : 'Todo período',
      stats,
      chartData: mockData
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'estatisticas.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <BaseLayout module="communication" items={menuItems}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Estatísticas</h1>
          <div className="flex gap-4">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              className="w-[300px]"
            />
            <Button onClick={handleExport}>Exportar</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalMessages}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chats Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.activeChats}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Satisfação</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.satisfactionRate}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    name="Mensagens"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="chats"
                    name="Chats"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  )
} 