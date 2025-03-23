'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Clock, Calendar, AlertCircle, PencilIcon } from 'lucide-react'
import { useBusinessHours, useDeleteBusinessHours } from '../hooks/use-business-hours'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

const weekDays = {
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
  sunday: 'Domingo',
} as const

export function BusinessHoursList() {
  const router = useRouter()
  const { data: businessHours, isLoading } = useBusinessHours()
  const { mutateAsync: deleteBusinessHours, isPending: isDeleting } = useDeleteBusinessHours()
  const [businessHoursToDelete, setBusinessHoursToDelete] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteBusinessHours(id)
      
      if (result.success) {
        toast.success('Horário deletado com sucesso!')
        setBusinessHoursToDelete(null)
      } else {
        toast.error(result.error?.message || 'Erro ao deletar horário')
      }
    } catch (error) {
      console.error('Erro ao deletar horário:', error)
      toast.error('Erro ao deletar horário. Tente novamente.')
    }
  }

  const formatTime = (time?: string) => {
    if (!time) return ''
    return time.slice(0, 5) // Formato HH:mm
  }

  const getActiveDaysCount = (schedule: typeof businessHours[number]['schedule']) => {
    return Object.values(schedule).filter(day => day.enabled).length
  }

  const formatSchedule = (schedule: typeof businessHours[number]['schedule']) => {
    return Object.entries(schedule)
      .filter(([_, day]) => day.enabled)
      .map(([key, day]) => (
        `${weekDays[key as keyof typeof weekDays]}: ${formatTime(day.openTime)} - ${formatTime(day.closeTime)}`
      ))
      .join(', ')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin mr-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Carregando horários...</p>
      </div>
    )
  }

  if (!businessHours?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum horário encontrado</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Configure os horários de atendimento para diferentes dias da semana para gerenciar
            quando sua equipe estará disponível.
          </p>
          <Button onClick={() => router.push('/settings/business-hours/new')}>
            Criar horário de funcionamento
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Dias ativos</TableHead>
            <TableHead className="hidden md:table-cell">Detalhes</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessHours.map((hours) => (
            <TableRow key={hours.id}>
              <TableCell className="font-medium">{hours.name}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getActiveDaysCount(hours.schedule)} dias
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {formatSchedule(hours.schedule)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/settings/business-hours/${hours.id}/edit`)}
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  
                  <AlertDialog 
                    open={businessHoursToDelete === hours.id}
                    onOpenChange={(open) => !open && setBusinessHoursToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setBusinessHoursToDelete(hours.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir horário</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este horário de funcionamento? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(hours.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Excluindo...' : 'Excluir'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 