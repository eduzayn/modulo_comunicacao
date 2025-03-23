'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Loader2, Search, AlertCircle, InfoIcon, CheckCircle, RefreshCw } from 'lucide-react'
import { LogLevel } from '@/lib/logger'

interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  message: string
  metadata?: Record<string, any>
}

interface ActivityLogProps {
  limit?: number
  showFilters?: boolean
}

export function ActivityLog({ limit = 10, showFilters = false }: ActivityLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<{
    level: LogLevel | 'all'
    search: string
  }>({
    level: 'all',
    search: '',
  })

  // Função para buscar logs do sistema
  const fetchLogs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Em uma implementação real, esta seria uma chamada de API
      // para buscar logs do sistema de backend
      // await fetch('/api/logs?limit=' + limit)
      
      // Simulação de dados para desenvolvimento
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      // Dados simulados de log
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          level: 'info',
          message: 'Usuário logado com sucesso',
          metadata: { userId: 'user123', method: 'password' }
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          level: 'error',
          message: 'Falha na integração com API externa',
          metadata: { service: 'whatsapp', error: 'Connection timeout' }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
          level: 'warn',
          message: 'Tentativa de acesso negado a recurso protegido',
          metadata: { userId: 'user456', resource: '/admin/settings' }
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
          level: 'info',
          message: 'Nova mensagem recebida via WhatsApp',
          metadata: { channelId: 'whatsapp', contactId: 'contact789' }
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
          level: 'debug',
          message: 'Processando fila de mensagens',
          metadata: { queueSize: 25, processingTime: '2.3s' }
        },
        {
          id: '6',
          timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
          level: 'info',
          message: 'Backup do banco de dados concluído',
          metadata: { size: '1.2GB', duration: '45s' }
        },
        {
          id: '7',
          timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
          level: 'error',
          message: 'Erro ao processar pagamento',
          metadata: { orderId: '12345', gateway: 'stripe', errorCode: 'card_declined' }
        },
        {
          id: '8',
          timestamp: new Date(Date.now() - 75 * 60000).toISOString(),
          level: 'warn',
          message: 'Alto uso de CPU detectado',
          metadata: { usage: '85%', duration: '10min' }
        },
        {
          id: '9',
          timestamp: new Date(Date.now() - 85 * 60000).toISOString(),
          level: 'info',
          message: 'Nova configuração de canal aplicada',
          metadata: { channel: 'email', updatedBy: 'admin' }
        },
        {
          id: '10',
          timestamp: new Date(Date.now() - 95 * 60000).toISOString(),
          level: 'debug',
          message: 'Cache limpo com sucesso',
          metadata: { items: 230, size: '15MB' }
        },
        {
          id: '11',
          timestamp: new Date(Date.now() - 105 * 60000).toISOString(),
          level: 'info',
          message: 'Novo contato adicionado',
          metadata: { contactId: 'contact123', source: 'manual' }
        },
        {
          id: '12',
          timestamp: new Date(Date.now() - 115 * 60000).toISOString(),
          level: 'warn',
          message: 'Taxa de envio de mensagens próxima do limite',
          metadata: { current: '950/hour', limit: '1000/hour' }
        }
      ]
      
      setLogs(mockLogs.slice(0, limit))
    } catch (err) {
      setError('Falha ao carregar logs do sistema')
      console.error('Erro ao buscar logs:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [limit])

  // Filtrar logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filtrar por nível
      if (filter.level !== 'all' && log.level !== filter.level) {
        return false
      }
      
      // Filtrar por texto de busca
      if (filter.search && !log.message.toLowerCase().includes(filter.search.toLowerCase())) {
        return false
      }
      
      return true
    })
  }, [logs, filter])

  // Renderizar ícone com base no nível do log
  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warn':
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case 'info':
        return <InfoIcon className="h-4 w-4 text-blue-500" />
      case 'debug':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <InfoIcon className="h-4 w-4" />
    }
  }

  // Formatação de data/hora mais legível
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  // Renderizar badge de nível
  const getLevelBadge = (level: LogLevel) => {
    const variants: Record<LogLevel, string> = {
      error: 'destructive',
      warn: 'warning',
      info: 'default',
      debug: 'outline'
    }
    
    return (
      <Badge variant={variants[level] as any}>
        {level.toUpperCase()}
      </Badge>
    )
  }

  if (error) {
    return (
      <Card className="p-4 text-center text-red-500">
        <AlertCircle className="h-6 w-6 mx-auto mb-2" />
        <p>{error}</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={fetchLogs}>
          Tentar novamente
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar nos logs..."
                className="pl-8"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
          </div>
          <Select
            value={filter.level}
            onValueChange={(value) => setFilter({ ...filter, level: value as LogLevel | 'all' })}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filtrar por nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Aviso</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" variant="outline" onClick={fetchLogs} title="Atualizar logs">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredLogs.length > 0 ? (
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start p-3 rounded-md border text-sm hover:bg-muted/50 transition-colors"
            >
              <div className="mr-3 pt-0.5">
                {getLevelIcon(log.level)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium truncate">{log.message}</span>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    {getLevelBadge(log.level)}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                </div>
                {log.metadata && (
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 text-muted-foreground">
          {filter.level !== 'all' || filter.search ? (
            <>
              <p>Nenhum log encontrado com os filtros atuais.</p>
              <Button 
                variant="link" 
                className="mt-2" 
                onClick={() => setFilter({ level: 'all', search: '' })}
              >
                Limpar filtros
              </Button>
            </>
          ) : (
            <p>Nenhum log para exibir.</p>
          )}
        </div>
      )}
    </div>
  )
} 