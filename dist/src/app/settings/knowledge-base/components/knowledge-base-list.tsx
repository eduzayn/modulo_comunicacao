'use client'

import { useKnowledgeBase } from '../hooks/use-knowledge-base'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Pencil, Trash2, Plus, FileText, BarChart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function KnowledgeBaseList() {
  const router = useRouter()
  const { knowledgeBases, isLoadingList, delete: deleteKnowledgeBase } = useKnowledgeBase()

  function handleEdit(id: string) {
    router.push(`/settings/knowledge-base/${id}`)
  }

  function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir esta base de conhecimento?')) {
      deleteKnowledgeBase(id)
    }
  }

  function handleAddContent(id: string) {
    router.push(`/settings/knowledge-base/${id}/content/new`)
  }

  function handleViewMetrics(id: string) {
    router.push(`/settings/knowledge-base/${id}/metrics`)
  }

  if (isLoadingList) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bases de Conhecimento</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!knowledgeBases?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bases de Conhecimento</CardTitle>
          <CardDescription>Nenhuma base de conhecimento encontrada.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/settings/knowledge-base/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Base de Conhecimento
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Bases de Conhecimento</CardTitle>
          <CardDescription>
            Gerencie suas bases de conhecimento para treinar a IA.
          </CardDescription>
        </div>
        <Button onClick={() => router.push('/settings/knowledge-base/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Base
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {knowledgeBases.map((knowledgeBase) => (
            <div
              key={knowledgeBase.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{knowledgeBase.name}</h3>
                  <Badge variant={knowledgeBase.settings.status === 'active' ? 'success' : 'warning'}>
                    {knowledgeBase.settings.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{knowledgeBase.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    Criado {formatDistanceToNow(new Date(knowledgeBase.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                  <span>•</span>
                  <span>{knowledgeBase.content ? knowledgeBase.content.length : 0} conteúdos</span>
                  <span>•</span>
                  <span>
                    {knowledgeBase.usage?.totalQueries || 0} consultas
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(knowledgeBase.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddContent(knowledgeBase.id)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Adicionar Conteúdo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewMetrics(knowledgeBase.id)}>
                    <BarChart className="mr-2 h-4 w-4" />
                    Ver Métricas
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(knowledgeBase.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 