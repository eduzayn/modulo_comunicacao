'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-xl font-semibold">Seu Perfil</h1>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src="" alt="Foto de perfil" />
            <AvatarFallback className="text-4xl">AL</AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">
            Arraste e solte uma foto ou faça Upload
          </p>
          <p className="text-xs text-muted-foreground">
            JPEG/PNG - Min. 100x100px
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Nome</label>
            <div className="flex w-[400px] items-center gap-2">
              <Input defaultValue="Ana Lúcia Moreira Gonçalves" />
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">E-mail</label>
            <div className="flex w-[400px] items-center gap-2">
              <Input defaultValue="ana.diretoria@eduzayn.com.br" />
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Celular</label>
            <div className="flex w-[400px] items-center gap-2">
              <Input defaultValue="37998694620" />
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Senha</label>
            <div className="flex w-[400px] items-center gap-2">
              <Input type="password" value="••••••••" />
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Compartilhamento de conversas
            </label>
            <div className="flex w-[400px] items-center gap-2">
              <Input defaultValue="Padrão" />
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 