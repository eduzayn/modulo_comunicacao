'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useTags, useDeleteTag } from '../hooks/use-tags'
import { toast } from 'sonner'

export function TagList() {
  const { data: tags, isLoading } = useTags()
  const { mutateAsync: deleteTag, isPending: isDeleting } = useDeleteTag()

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteTag(id)
      
      if (result.success) {
        toast.success('Tag deletada com sucesso!')
      } else {
        toast.error(result.error?.message || 'Erro ao deletar tag')
      }
    } catch (error) {
      console.error('Erro ao deletar tag:', error)
      toast.error('Erro ao deletar tag. Tente novamente.')
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!tags?.length) {
    return <div>Nenhuma tag encontrada.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Cor</TableHead>
          <TableHead>Visibilidade</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.map((tag) => (
          <TableRow key={tag.id}>
            <TableCell>{tag.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full bg-${tag.color}-500`}
                />
                {tag.color}
              </div>
            </TableCell>
            <TableCell>
              {tag.visibility === 'all' && 'Todos os agentes'}
              {tag.visibility === 'group' && 'Grupo específico'}
              {tag.visibility === 'personal' && 'Apenas para mim'}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(tag.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 