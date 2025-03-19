'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MoreHorizontal, Search, Trash2, Edit, Play } from 'lucide-react'
import {
  useDeleteKnowledgeBase,
  useKnowledgeBaseList,
  useTrainKnowledgeBase,
} from '../hooks/use-knowledge-base'
import type { KnowledgeBaseSearchOptions } from '../types'

const contentTypeOptions = [
  { value: 'pdf', label: 'PDF' },
  { value: 'text', label: 'Texto' },
  { value: 'qa', label: 'Perguntas e Respostas' },
  { value: 'flow', label: 'Fluxo de Conversa' },
  { value: 'script', label: 'Script' },
  { value: 'api', label: 'API' },
  { value: 'rules', label: 'Regras' },
]

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'processing', label: 'Processando' },
  { value: 'trained', label: 'Treinado' },
  { value: 'failed', label: 'Falhou' },
  { value: 'outdated', label: 'Desatualizado' },
]

export function KnowledgeBaseList() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState<KnowledgeBaseSearchOptions>({
    filter: {},
    sort: {
      field: 'createdAt',
      direction: 'desc',
    },
    page: 1,
    limit: 10,
  })

  const { data: response, isLoading } = useKnowledgeBaseList(searchParams)
  const { mutateAsync: deleteKnowledgeBaseMutation } = useDeleteKnowledgeBase()
  const { mutateAsync: trainKnowledgeBaseMutation } = useTrainKnowledgeBase()

  const knowledgeBases = response?.data?.data ?? []
  const total = response?.data?.total ?? 0

  async function handleDelete(id: string) {
    await deleteKnowledgeBaseMutation(id)
  }

  async function handleTrain(id: string) {
    await trainKnowledgeBaseMutation(id)
  }

  function handleEdit(id: string) {
    router.push(`/settings/knowledge-base/${id}`)
  }

  function handleSearch(search: string) {
    setSearchParams((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        search,
      },
    }))
  }

  function handleFilterType(type: string) {
    setSearchParams((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        type,
      },
    }))
  }

  function handleFilterStatus(status: string) {
    setSearchParams((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        status,
      },
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar base de conhecimento"
              className="pl-8"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <Select
          onValueChange={handleFilterType}
          defaultValue={searchParams.filter.type}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os tipos</SelectItem>
            {contentTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={handleFilterStatus}
          defaultValue={searchParams.filter.status}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Fonte</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : knowledgeBases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Nenhuma base de conhecimento encontrada
                </TableCell>
              </TableRow>
            ) : (
              knowledgeBases.map((knowledgeBase) => (
                <TableRow key={knowledgeBase.id}>
                  <TableCell>{knowledgeBase.name}</TableCell>
                  <TableCell>
                    {contentTypeOptions.find(
                      (option) => option.value === knowledgeBase.type
                    )?.label ?? knowledgeBase.type}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        knowledgeBase.trainingInfo.status === 'trained'
                          ? 'success'
                          : knowledgeBase.trainingInfo.status === 'failed'
                          ? 'destructive'
                          : knowledgeBase.trainingInfo.status === 'processing'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {
                        statusOptions.find(
                          (option) =>
                            option.value === knowledgeBase.trainingInfo.status
                        )?.label
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {knowledgeBase.metadata.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{knowledgeBase.metadata.source}</TableCell>
                  <TableCell>{knowledgeBase.metadata.version}</TableCell>
                  <TableCell>{knowledgeBase.settings.priority}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEdit(knowledgeBase.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleTrain(knowledgeBase.id)}
                          disabled={
                            knowledgeBase.trainingInfo.status === 'processing'
                          }
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Treinar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(knowledgeBase.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Total de {total} base{total === 1 ? '' : 's'} de conhecimento
          </p>
        </div>
      )}
    </div>
  )
} 