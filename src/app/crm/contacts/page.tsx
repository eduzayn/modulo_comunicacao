'use client'

import { PageContainer } from '@/components/page-container/page-container'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusCircle, Search, Mail, Phone, ExternalLink, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Dados de exemplo
const contacts = [
  {
    id: '1',
    name: 'Kelly Cristina Daniel da Costa',
    email: 'kelly@exemplo.com',
    phone: '+55 21 99903-6911',
    status: 'Em Negociação',
    group: 'TUTORIA MÚSICA',
    lastContact: '30 minutos atrás'
  },
  {
    id: '2',
    name: 'Maria Inez',
    email: 'maria@exemplo.com',
    phone: '+55 11 98765-4321',
    status: 'Lead',
    group: 'ORGÂNICO - COMERCIAL',
    lastContact: '2 horas atrás'
  },
  {
    id: '3',
    name: 'Carlos Eduardo Ferreira',
    email: 'carlos@exemplo.com',
    phone: '+55 31 99876-5432',
    status: 'Cliente',
    group: 'PRIMEIRA GRADUAÇÃO',
    lastContact: 'ontem'
  },
  {
    id: '4',
    name: 'Simone Cristina da Silva',
    email: 'simone@exemplo.com',
    phone: '+55 11 97654-3210',
    status: 'Em Negociação',
    group: 'DESQUALIFICADOS',
    lastContact: '3 dias atrás'
  },
  {
    id: '5',
    name: 'Roberto Alves Santos',
    email: 'roberto@exemplo.com',
    phone: '+55 21 98765-1234',
    status: 'Lead',
    group: 'PLATAFORMA UNICV',
    lastContact: '1 semana atrás'
  }
]

export default function ContactsPage() {
  const router = useRouter()
  
  return (
    <PageContainer
      title="Contatos"
      description="Gerencie seus contatos e leads"
      breadcrumbItems={[
        { href: '/crm', label: 'CRM' },
        { href: '/crm/contacts', label: 'Contatos' }
      ]}
      action={{
        label: 'Novo Contato',
        onClick: () => router.push('/crm/contacts/new'),
        variant: 'default'
      }}
    >
      <div className="flex justify-between mb-6">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            type="search" 
            placeholder="Buscar contatos..." 
            className="w-full"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Último Contato</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                        {contact.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                        {contact.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={contact.status === 'Cliente' ? 'default' : 
                              contact.status === 'Em Negociação' ? 'secondary' : 'outline'}
                    >
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.group}</TableCell>
                  <TableCell>{contact.lastContact}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => router.push(`/crm/contacts/${contact.id}`)}
                        >
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 mr-2" />
                          Ligar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  )
} 