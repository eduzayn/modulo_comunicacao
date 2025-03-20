'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Trash2, Edit, MessageSquare } from 'lucide-react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from '@/hooks/use-contacts';

// Tipos
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Aluno' | 'Professor' | 'Parceiro' | 'Outro';
}

// Dados de exemplo
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@exemplo.com', phone: '(11) 98765-4321', type: 'Aluno' },
  { id: '2', name: 'João Santos', email: 'joao@exemplo.com', phone: '(11) 91234-5678', type: 'Professor' },
  { id: '3', name: 'Ana Pereira', email: 'ana@exemplo.com', phone: '(11) 99876-5432', type: 'Aluno' },
  { id: '4', name: 'Carlos Oliveira', email: 'carlos@exemplo.com', phone: '(11) 92345-6789', type: 'Parceiro' },
  { id: '5', name: 'Juliana Costa', email: 'juliana@exemplo.com', phone: '(11) 93456-7890', type: 'Aluno' },
];

export default function ContactsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Queries e Mutations
  const { data: contacts = [], isLoading } = useContacts(searchTerm);
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const selectedContactData = contacts.find(contact => contact.id === selectedContact);

  const handleAddContact = async (data: any) => {
    try {
      await createContact.mutateAsync(data);
      setIsNewContactOpen(false);
      toast({
        title: 'Contato adicionado',
        description: 'O contato foi adicionado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar contato. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleEditContact = async (data: any) => {
    if (!selectedContact) return;
    try {
      await updateContact.mutateAsync({ id: selectedContact, ...data });
      setIsEditContactOpen(false);
      toast({
        title: 'Contato atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar contato. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    try {
      await deleteContact.mutateAsync(selectedContact);
      setSelectedContact(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: 'Contato excluído',
        description: 'O contato foi excluído com sucesso.',
        variant: 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir contato. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contatos</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar contatos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button onClick={() => setIsNewContactOpen(true)} className="flex-1 md:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Lista de Contatos</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {contacts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum contato encontrado</p>
                ) : (
                  contacts.map(contact => (
                    <div 
                      key={contact.id}
                      className={`p-2 rounded-md cursor-pointer ${selectedContact === contact.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedContact(contact.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-500">{contact.email}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {selectedContactData ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Detalhes do Contato</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditContactOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl">
                      {selectedContactData.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedContactData.name}</h3>
                      <p className="text-sm text-gray-500">{selectedContactData.type}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p>{selectedContactData.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                      <p>{selectedContactData.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                      <p>{selectedContactData.type}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <p>Ativo</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Histórico de Interações</h4>
                    <div className="space-y-2">
                      <div className="p-2 border rounded-md">
                        <p className="text-sm">Mensagem enviada via WhatsApp</p>
                        <p className="text-xs text-gray-500">Ontem às 14:30</p>
                      </div>
                      <div className="p-2 border rounded-md">
                        <p className="text-sm">Email de boas-vindas enviado</p>
                        <p className="text-xs text-gray-500">10/03/2025 às 09:15</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditContactOpen(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Iniciar Conversa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-8 text-center text-gray-500">
                Selecione um contato para ver os detalhes
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Novo Contato */}
      <Dialog open={isNewContactOpen} onOpenChange={setIsNewContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Contato</DialogTitle>
          </DialogHeader>
          <ContactForm
            onSubmit={handleAddContact}
            onCancel={() => setIsNewContactOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditContactOpen} onOpenChange={setIsEditContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
          </DialogHeader>
          <ContactForm
            initialData={selectedContactData}
            onSubmit={handleEditContact}
            onCancel={() => setIsEditContactOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Contato</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteContact}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
