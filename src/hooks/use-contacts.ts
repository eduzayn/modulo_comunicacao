import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Contact, ContactFormData } from '@/types/contacts';

// Dados de exemplo
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@exemplo.com', phone: '(11) 98765-4321', type: 'Aluno' },
  { id: '2', name: 'João Santos', email: 'joao@exemplo.com', phone: '(11) 91234-5678', type: 'Professor' },
  { id: '3', name: 'Ana Pereira', email: 'ana@exemplo.com', phone: '(11) 99876-5432', type: 'Aluno' },
  { id: '4', name: 'Carlos Oliveira', email: 'carlos@exemplo.com', phone: '(11) 92345-6789', type: 'Parceiro' },
  { id: '5', name: 'Juliana Costa', email: 'juliana@exemplo.com', phone: '(11) 93456-7890', type: 'Aluno' },
];

// Funções de API simuladas
const api = {
  getContacts: async (search?: string): Promise<Contact[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
    if (!search) return MOCK_CONTACTS;
    return MOCK_CONTACTS.filter(contact =>
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase())
    );
  },

  createContact: async (data: ContactFormData): Promise<Contact> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newContact: Contact = {
      id: Math.random().toString(36).substring(7),
      ...data,
    };
    MOCK_CONTACTS.push(newContact);
    return newContact;
  },

  updateContact: async (id: string, data: ContactFormData): Promise<Contact> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = MOCK_CONTACTS.findIndex(contact => contact.id === id);
    if (index === -1) throw new Error('Contato não encontrado');
    const updatedContact: Contact = { ...data, id };
    MOCK_CONTACTS[index] = updatedContact;
    return updatedContact;
  },

  deleteContact: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = MOCK_CONTACTS.findIndex(contact => contact.id === id);
    if (index === -1) throw new Error('Contato não encontrado');
    MOCK_CONTACTS.splice(index, 1);
  },
};

// Hooks
export function useContacts(search?: string) {
  return useQuery({
    queryKey: ['contacts', search],
    queryFn: () => api.getContacts(search),
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactFormData) => api.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: ContactFormData & { id: string }) =>
      api.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
} 