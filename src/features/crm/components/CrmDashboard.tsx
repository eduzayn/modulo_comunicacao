'use client'

import { useState } from 'react'
import { ContactList } from './ContactList'
import { DealList } from './DealList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface CrmDashboardProps {
  userId: string
}

/**
 * Dashboard principal da feature de CRM
 */
export function CrmDashboard({ userId }: CrmDashboardProps) {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [contactDetailsOpen, setContactDetailsOpen] = useState(false)
  
  // Manipular a seleção de um contato
  const handleSelectContact = (id: string) => {
    setSelectedContactId(id)
    setContactDetailsOpen(true)
  }
  
  // Fechar os detalhes do contato
  const handleCloseContactDetails = () => {
    setContactDetailsOpen(false)
  }
  
  // Callback quando um contato é excluído
  const handleContactDeleted = (id: string) => {
    if (selectedContactId === id) {
      setContactDetailsOpen(false)
      setSelectedContactId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">CRM</h2>
        <p className="text-muted-foreground">
          Gerencie contatos e negociações com clientes, alunos e parceiros.
        </p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts" className="space-y-4">
          <ContactList 
            onSelectContact={handleSelectContact} 
            onDeleteContact={handleContactDeleted}
          />
        </TabsContent>
        
        <TabsContent value="pipeline">
          <div className="border rounded-md p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Pipeline de Vendas</h3>
            <p className="text-muted-foreground">
              Visualização do pipeline em desenvolvimento...
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="border rounded-md p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Análises e Relatórios</h3>
            <p className="text-muted-foreground">
              Dashboards e relatórios em desenvolvimento...
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Painel lateral para detalhes do contato */}
      <Sheet open={contactDetailsOpen} onOpenChange={setContactDetailsOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader className="mb-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCloseContactDetails}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <SheetTitle>Detalhes do Contato</SheetTitle>
            </div>
          </SheetHeader>
          
          {selectedContactId && (
            <div className="space-y-6">
              {/* Aqui poderia ter um componente de detalhes do contato */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Informações</h3>
                <Separator />
                <p className="text-muted-foreground">
                  ID do contato: {selectedContactId}
                </p>
              </div>
              
              {/* Lista de negociações do contato */}
              <DealList contactId={selectedContactId} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
} 