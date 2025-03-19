'use client'

import { BaseLayout } from '@/components/layout/BaseLayout'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bell, Mail, MessageSquare, Clock, Shield } from 'lucide-react'
import { FC } from 'react'

const SettingsPage: FC = () => {
  return (
    <BaseLayout module="communication">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie suas preferências de comunicação
          </p>
        </div>

        <div className="grid gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notificações</h3>
            <div className="space-y-4">
              {[
                {
                  title: 'Notificações Push',
                  description: 'Receber alertas no navegador',
                  icon: <Bell className="h-4 w-4" />,
                  enabled: true
                },
                {
                  title: 'Notificações por Email',
                  description: 'Receber resumos por email',
                  icon: <Mail className="h-4 w-4" />,
                  enabled: true
                },
                {
                  title: 'Mensagens Instantâneas',
                  description: 'Notificações em tempo real',
                  icon: <MessageSquare className="h-4 w-4" />,
                  enabled: false
                }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch checked={item.enabled} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preferências de Mensagens</h3>
            <div className="space-y-4">
              {[
                {
                  title: 'Horário de Atendimento',
                  description: 'Definir período de disponibilidade',
                  icon: <Clock className="h-4 w-4" />,
                  value: '09:00 - 18:00'
                },
                {
                  title: 'Privacidade',
                  description: 'Configurações de visibilidade',
                  icon: <Shield className="h-4 w-4" />,
                  value: 'Apenas contatos'
                }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Input value={item.value} className="w-40" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Mensagem Automática</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Mensagem de Ausência</p>
                <Input 
                  className="w-full"
                  placeholder="Digite sua mensagem automática..."
                  value="Olá! No momento não estou disponível, mas retornarei seu contato em breve."
                />
              </div>
              <div className="flex justify-end">
                <Button>Salvar Alterações</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </BaseLayout>
  )
}

export default SettingsPage 