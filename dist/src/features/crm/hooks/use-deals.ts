'use client'

import { useState, useCallback } from 'react'
import type { Deal, CreateDealData, DealState } from '../types/crm.types'
import { 
  createDeal, 
  getDealsByContact, 
  updateDealStage, 
  deleteDeal 
} from '../services/crm-service'

/**
 * Hook para gerenciar negociações
 */
export function useDeals(initialContactId?: string) {
  const [state, setState] = useState<DealState>({
    deals: [],
    selectedDeal: null,
    isLoading: false,
    error: null
  })

  // Buscar negociações por contato
  const fetchDealsByContact = useCallback(async (contactId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const dealsData = await getDealsByContact(contactId)
      setState(prev => ({
        ...prev,
        deals: dealsData,
        isLoading: false
      }))
      return dealsData
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar negociações'
      }))
      throw error
    }
  }, [])

  // Inicializar negociações para um contato
  const initializeDeals = useCallback(async () => {
    if (initialContactId) {
      await fetchDealsByContact(initialContactId)
    }
  }, [initialContactId, fetchDealsByContact])

  // Adicionar uma nova negociação
  const addDeal = useCallback(async (data: CreateDealData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const newDeal = await createDeal(data)
      setState(prev => ({
        ...prev,
        deals: [newDeal, ...prev.deals],
        isLoading: false
      }))
      return newDeal
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao criar negociação'
      }))
      throw error
    }
  }, [])

  // Atualizar estágio de uma negociação
  const changeDealStage = useCallback(async (dealId: string, stage: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      await updateDealStage(dealId, stage)
      setState(prev => ({
        ...prev,
        deals: prev.deals.map(deal => 
          deal.id === dealId ? { ...deal, stage, updated_at: new Date().toISOString() } : deal
        ),
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar negociação'
      }))
      throw error
    }
  }, [])

  // Remover uma negociação
  const removeDeal = useCallback(async (dealId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      await deleteDeal(dealId)
      setState(prev => ({
        ...prev,
        deals: prev.deals.filter(deal => deal.id !== dealId),
        selectedDeal: prev.selectedDeal === dealId ? null : prev.selectedDeal,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao excluir negociação'
      }))
      throw error
    }
  }, [])

  // Selecionar uma negociação
  const selectDeal = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedDeal: id }))
  }, [])

  return {
    ...state,
    fetchDealsByContact,
    initializeDeals,
    addDeal,
    changeDealStage,
    removeDeal,
    selectDeal
  }
} 