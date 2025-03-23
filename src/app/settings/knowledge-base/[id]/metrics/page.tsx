'use client'

import { useKnowledgeBase } from '../../hooks/use-knowledge-base'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface KnowledgeBaseMetricsPageProps {
  params: {
    id: string
  }
}

export default function KnowledgeBaseMetricsPage({ params }: KnowledgeBaseMetricsPageProps) {
  const { knowledgeBase, isLoading } = useKnowledgeBase(params.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!knowledgeBase) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Base de conhecimento não encontrada.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Métricas da Base de Conhecimento</h1>
        <p className="text-muted-foreground">
          Visualize as métricas de uso e desempenho da base de conhecimento.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{knowledgeBase.usage.totalQueries}</div>
            <p className="text-xs text-muted-foreground">
              Consultas realizadas à base de conhecimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latência Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {knowledgeBase.usage.averageLatency.toFixed(2)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Tempo médio de resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(knowledgeBase.usage.errorRate * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Percentual de consultas com erro
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acurácia do Treinamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(knowledgeBase.training.metrics.accuracy * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Precisão do modelo treinado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Treinamento</CardTitle>
            <CardDescription>
              Detalhes sobre o último treinamento realizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm">{knowledgeBase.training.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Início</span>
                <span className="text-sm">
                  {new Date(knowledgeBase.training.started_at).toLocaleString()}
                </span>
              </div>
              {knowledgeBase.training.completed_at && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Conclusão</span>
                  <span className="text-sm">
                    {new Date(knowledgeBase.training.completed_at).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total de Tokens</span>
                <span className="text-sm">{knowledgeBase.training.metrics.total_tokens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Tempo de Treinamento</span>
                <span className="text-sm">{knowledgeBase.training.metrics.training_time}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Taxa de Erro</span>
                <span className="text-sm">
                  {(knowledgeBase.training.metrics.error_rate * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>
              Configurações atuais da base de conhecimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Idioma</span>
                <span className="text-sm">{knowledgeBase.settings.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Máximo de Tokens</span>
                <span className="text-sm">{knowledgeBase.settings.maxTokens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Temperatura</span>
                <span className="text-sm">{knowledgeBase.settings.temperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm">{knowledgeBase.settings.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 