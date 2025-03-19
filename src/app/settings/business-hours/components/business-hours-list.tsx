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
import { useBusinessHours, useDeleteBusinessHours } from '../hooks/use-business-hours'
import { toast } from 'sonner'

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
  const { data: businessHours, isLoading } = useBusinessHours()
  const { mutateAsync: deleteBusinessHours, isPending: isDeleting } = useDeleteBusinessHours()

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteBusinessHours(id)
      
      if (result.success) {
        toast.success('Horário deletado com sucesso!')
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

  const formatSchedule = (schedule: typeof businessHours[number]['schedule']) => {
    return Object.entries(schedule)
      .filter(([_, day]) => day.enabled)
      .map(([key, day]) => (
        `${weekDays[key as keyof typeof weekDays]}: ${formatTime(day.openTime)} - ${formatTime(day.closeTime)}`
      ))
      .join(', ')
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!businessHours?.length) {
    return <div>Nenhum horário encontrado.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Horários</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businessHours.map((hours) => (
          <TableRow key={hours.id}>
            <TableCell>{hours.name}</TableCell>
            <TableCell>{formatSchedule(hours.schedule)}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(hours.id)}
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