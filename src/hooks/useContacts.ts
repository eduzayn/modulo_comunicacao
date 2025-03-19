import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Aluno' | 'Professor' | 'Parceiro' | 'Outro';
}

// Funções de API
async function fetchContacts(search?: string) {
  const response = await fetch(`/api/contacts${search ? `?search=${search}` : ''}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar contatos');
  }
  return response.json();
}

async function createContact(data: Omit<Contact, 'id'>) {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Erro ao criar contato');
  }
  return response.json();
}

async function updateContact(id: string, data: Omit<Contact, 'id'>) {
  const response = await fetch(`/api/contacts`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar contato');
  }
  return response.json();
}

async function deleteContact(id: string) {
  const response = await fetch(`/api/contacts?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao excluir contato');
  }
}

// Hooks
export function useContacts(search?: string) {
  return useQuery({
    queryKey: ['contacts', search],
    queryFn: () => fetchContacts(search),
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Contact) => updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
} 