'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';

// Dados de exemplo para contatos
const MOCK_CONTACTS = [
  { id: '1', name: 'Maria Silva', email: 'maria@exemplo.com', phone: '(11) 98765-4321', type: 'Aluno' },
  { id: '2', name: 'João Santos', email: 'joao@exemplo.com', phone: '(11) 91234-5678', type: 'Professor' },
  { id: '3', name: 'Ana Pereira', email: 'ana@exemplo.com', phone: '(11) 99876-5432', type: 'Aluno' },
  { id: '4', name: 'Carlos Oliveira', email: 'carlos@exemplo.com', phone: '(11) 92345-6789', type: 'Parceiro' },
  { id: '5', name: 'Juliana Costa', email: 'juliana@exemplo.com', phone: '(11) 93456-7890', type: 'Aluno' },
];

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  
  const filteredContacts = MOCK_CONTACTS.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );
  
  const selectedContactData = MOCK_CONTACTS.find(contact => contact.id === selectedContact);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contatos</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contatos..."
            className="w-full pl-8 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 border rounded-md flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4" />
            Filtrar
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" />
            Novo Contato
          </button>
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
                {filteredContacts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum contato encontrado</p>
                ) : (
                  filteredContacts.map(contact => (
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
              <div className="p-4 border-b">
                <h2 className="font-semibold">Detalhes do Contato</h2>
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
                    <button className="px-4 py-2 border rounded-md">Editar</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Iniciar Conversa</button>
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
    </div>
  );
}
