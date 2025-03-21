'use client'

import { useState, useCallback } from 'react'
import type { Contact, ContactFormData, ContactFilters, ContactsState } from '../types/crm.types'
import { 
  getContacts, 
  getContactById, 
  createContact, 
  updateContact, 
  deleteContact 
} from '../services/crm-service'

/**
 * Hook para gerenciar contatos
 */
export function useContacts(initialFilters: ContactFilters = {}) {
  const [state, setState] = useState<ContactsState>({
    contacts: [],
    selectedContact: null,
    filters: initialFilters,
    isLoading: false,
    error: null
  })

  // Buscar contatos com filtros
  const fetchContacts = useCallback(async (filters?: ContactFilters) => {
    const currentFilters = filters || state.filters
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const contactsData = await getContacts(currentFilters.search, currentFilters.type)
      setState(prev => ({
        ...prev,
        contacts: contactsData,
        isLoading: false,
        filters: currentFilters
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar contatos'
      }))
    }
  }, [state.filters])

  // Buscar um contato específico por ID
  const fetchContactById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const contact = await getContactById(id)
      setState(prev => ({
        ...prev,
        selectedContact: id,
        isLoading: false
      }))
      return contact
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar contato'
      }))
      throw error
    }
  }, [])

  // Adicionar um novo contato
  const addContact = useCallback(async (data: ContactFormData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const newContact = await createContact(data)
      setState(prev => ({
        ...prev,
        contacts: [newContact, ...prev.contacts],
        isLoading: false
      }))
      return newContact
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao criar contato'
      }))
      throw error
    }
  }, [])

  // Atualizar um contato existente
  const editContact = useCallback(async (id: string, data: ContactFormData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const updatedContact = await updateContact(id, data)
      setState(prev => ({
        ...prev,
        contacts: prev.contacts.map(contact => 
          contact.id === id ? updatedContact : contact
        ),
        isLoading: false
      }))
      return updatedContact
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar contato'
      }))
      throw error
    }
  }, [])

  // Remover um contato
  const removeContact = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      await deleteContact(id)
      setState(prev => ({
        ...prev,
        contacts: prev.contacts.filter(contact => contact.id !== id),
        selectedContact: prev.selectedContact === id ? null : prev.selectedContact,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao excluir contato'
      }))
      throw error
    }
  }, [])

  // Selecionar um contato
  const selectContact = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedContact: id }))
  }, [])

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: ContactFilters) => {
    setState(prev => ({ 
      ...prev, 
      filters: { ...prev.filters, ...newFilters } 
    }))
  }, [])

  return {
    ...state,
    fetchContacts,
    fetchContactById,
    addContact,
    editContact,
    removeContact,
    selectContact,
    updateFilters
  }
} 