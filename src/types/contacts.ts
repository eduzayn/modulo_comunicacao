export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Aluno' | 'Professor' | 'Parceiro' | 'Outro';
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  type: Contact['type'];
}

export interface ContactFilters {
  search?: string;
  type?: Contact['type'];
}

export interface ContactsState {
  contacts: Contact[];
  selectedContact: string | null;
  filters: ContactFilters;
  isLoading: boolean;
  error: string | null;
} 