'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const inviteSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  role: z.enum(['gestor', 'agente', 'copia-agente', 'administrador'], {
    required_error: 'Permissão é obrigatória',
  }),
})

type InviteForm = z.infer<typeof inviteSchema>

interface Member {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  status: 'online' | 'offline' | 'invited'
  lastSeen?: string
}

const members: Member[] = [
  {
    id: '1',
    name: 'Ana Lúcia Moreira Gonçalves',
    email: 'ana.diretoria@eduzayn.com.br',
    role: 'Administrador',
    status: 'online',
  },
  {
    id: '2',
    name: 'Carla',
    email: 'carla-adm@eduzayn.com.br',
    role: 'Gestor',
    status: 'online',
  },
  {
    id: '3',
    name: 'Tamires Kele',
    email: 'coordzayn2023@gmail.com',
    role: 'Gestor',
    status: 'online',
  },
  {
    id: '4',
    name: 'Rian Moreira',
    email: 'zayn6675@gmail.com',
    role: 'Gestor',
    status: 'online',
  },
  {
    id: '5',
    name: 'Tutoria',
    email: 'pedagogico@grupozayneducacional.com.br',
    role: 'Agente',
    status: 'invited',
  },
  {
    id: '6',
    name: 'Alessandra Consultora',
    email: 'consultoraalessandra@outlook.com',
    role: 'Agente',
    status: 'online',
  },
  {
    id: '7',
    name: 'Monique',
    email: 'amanda.monyk@hotmail.com',
    role: 'Agente',
    status: 'online',
  },
]

export default function MembersPage() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
  })

  const onSubmit = async (data: InviteForm) => {
    try {
      // Aqui você implementaria a lógica de envio do convite
      console.log('Enviando convite:', data)
      setIsOpen(false)
      reset()
    } catch (error) {
      console.error('Erro ao enviar convite:', error)
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Membros</h1>
          <p className="text-sm text-muted-foreground">
            Ao convidar um usuário, ele receberá um e-mail com instruções de acesso
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>+ Convidar membro</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Convidar membro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input {...register('name')} />
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <Input type="email" {...register('email')} />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Permissão</label>
                  <Select
                    onValueChange={(value) =>
                      register('role').onChange({
                        target: { value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma permissão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gestor">Gestor</SelectItem>
                      <SelectItem value="agente">Agente</SelectItem>
                      <SelectItem value="copia-agente">Cópia de Agente</SelectItem>
                      <SelectItem value="administrador">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-xs text-destructive">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Enviar convite</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">
                  {member.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">{member.role}</div>
              <Badge
                variant={
                  member.status === 'online'
                    ? 'default'
                    : member.status === 'invited'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {member.status === 'online'
                  ? 'Online'
                  : member.status === 'invited'
                  ? 'Convidado'
                  : `${member.lastSeen || '<1'} minutos`}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 