'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserCircle, Bell, Users, UserCog, Settings } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações da Conta</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua conta e preferências
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/settings/account/profile')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Perfil</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Gerenciar suas informações pessoais e preferências de perfil
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/settings/account/notifications')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Notificações</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Configurar notificações por email, push e sons de alerta
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/settings/account/members')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Membros</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Gerenciar usuários, convites e permissões da equipe
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/settings/account/roles')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Funções e Permissões</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Configurar funções, permissões e controle de acesso
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/settings/account/workspace')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Workspace</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Personalizar configurações do workspace e preferências gerais
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="Perfil" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Ana Lúcia Moreira</p>
            <p className="text-xs text-muted-foreground">ana.diretoria@eduzayn.com.br</p>
          </div>
        </div>
      </div>
    </div>
  )
} 