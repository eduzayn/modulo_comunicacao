'use client'

import { BaseLayout } from '@/components/layout/BaseLayout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Search, Mail, Phone, MapPin } from 'lucide-react'

export default function ContactsPage() {
  return (
    <BaseLayout module="communication">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Contatos</h2>
            <p className="text-muted-foreground">
              Gerencie seus contatos e informações
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>

        <div className="flex gap-4">
          <Card className="w-full p-4">
            <div className="flex gap-4 mb-6">
              <Input 
                placeholder="Buscar contatos..." 
                className="flex-1"
                icon={<Search className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'Maria Silva',
                  role: 'Aluna',
                  email: 'maria.silva@email.com',
                  phone: '(11) 98765-4321',
                  location: 'São Paulo, SP'
                },
                {
                  name: 'João Santos',
                  role: 'Professor',
                  email: 'joao.santos@email.com',
                  phone: '(11) 98765-4322',
                  location: 'Rio de Janeiro, RJ'
                },
                {
                  name: 'Carlos Oliveira',
                  role: 'Aluno',
                  email: 'carlos.oliveira@email.com',
                  phone: '(11) 98765-4323',
                  location: 'Belo Horizonte, MG'
                },
                {
                  name: 'Ana Pereira',
                  role: 'Professora',
                  email: 'ana.pereira@email.com',
                  phone: '(11) 98765-4324',
                  location: 'Curitiba, PR'
                },
              ].map((contact, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-communication/10 flex items-center justify-center text-communication text-lg font-semibold">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.role}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2" />
                          {contact.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 mr-2" />
                          {contact.phone}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {contact.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </BaseLayout>
  )
} 