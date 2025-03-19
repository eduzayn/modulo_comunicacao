'use client'

import { useState } from 'react'
import { Search, Plus, Filter } from 'lucide-react'
import { ContactForm } from '@/components/contacts/ContactForm'
import { ContactList } from '@/components/contacts/ContactList'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from '@/hooks/useContacts'
import type { Contact, ContactFormData } from '@/types/contacts'

export default function ContactsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [isNewContactOpen, setIsNewContactOpen] = useState(false)
  const [isEditContactOpen, setIsEditContactOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Queries e Mutations
  const { data: contacts = [], isLoading } = useContacts(searchTerm)
  const createContact = useCreateContact()
  const updateContact = useUpdateContact()
  const deleteContact = useDeleteContact()

  const selectedContactData = contacts.find(contact => contact.id === selectedContact)

  const handleAddContact = async (data: ContactFormData) => {
    try {
      await createContact.mutateAsync(data)
      setIsNewContactOpen(false)
      toast({
        title: 'Contato adicionado',
        description: 'O contato foi adicionado com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar contato. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleEditContact = async (data: ContactFormData) => {
    if (!selectedContact) return
    try {
      await updateContact.mutateAsync({ id: selectedContact, ...data })
      setIsEditContactOpen(false)
      toast({
        title: 'Contato atualizado',
        description: 'As alterações foram salvas com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar contato. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteContact = async () => {
    if (!selectedContact) return
    try {
      await deleteContact.mutateAsync(selectedContact)
      setSelectedContact(null)
      setIsDeleteDialogOpen(false)
      toast({
        title: 'Contato excluído',
        description: 'O contato foi excluído com sucesso.',
        variant: 'destructive',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir contato. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contatos</h1>
          <p className="text-muted-foreground">
            Gerencie seus contatos
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar contatos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="contact-search"
            />
          </div>
          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            data-testid="filter-button"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button
            onClick={() => setIsNewContactOpen(true)}
            className="flex-1 md:flex-none"
            data-testid="new-contact-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>
      </div>

      <ContactList
        contacts={contacts}
        selectedId={selectedContact}
        onSelect={setSelectedContact}
        onEdit={(id) => {
          setSelectedContact(id)
          setIsEditContactOpen(true)
        }}
        onDelete={(id) => {
          setSelectedContact(id)
          setIsDeleteDialogOpen(true)
        }}
      />

      {/* Modal de Novo Contato */}
      <Dialog open={isNewContactOpen} onOpenChange={setIsNewContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Contato</DialogTitle>
          </DialogHeader>
          <ContactForm onSubmit={handleAddContact} />
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditContactOpen} onOpenChange={setIsEditContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
          </DialogHeader>
          <ContactForm
            onSubmit={handleEditContact}
            initialData={selectedContactData}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Contato</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este contato?</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteContact}
              data-testid="confirm-delete-button"
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 