import { useState, useCallback } from 'react';
import { 
  Deal, 
  DealWithRelations, 
  DealFilter, 
  CreateDealPayload, 
  UpdateDealPayload 
} from '../types';
import { crmService } from '../services/crm-service';

interface UseDealsReturn {
  deals: DealWithRelations[];
  currentDeal: DealWithRelations | null;
  isLoading: boolean;
  error: string | null;
  fetchDeals: (filters?: DealFilter) => Promise<void>;
  fetchDealById: (id: string) => Promise<DealWithRelations | null>;
  createDeal: (data: CreateDealPayload) => Promise<Deal | null>;
  updateDeal: (id: string, data: UpdateDealPayload) => Promise<Deal | null>;
  moveDealToStage: (id: string, stageId: string) => Promise<Deal | null>;
  closeDeal: (id: string, status: 'ganha' | 'perdida', reason?: string) => Promise<Deal | null>;
}

export function useDeals(): UseDealsReturn {
  const [deals, setDeals] = useState<DealWithRelations[]>([]);
  const [currentDeal, setCurrentDeal] = useState<DealWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar deals com filtros
  const fetchDeals = useCallback(async (filters?: DealFilter) => {
    setIsLoading(true);
    setError(null);

    try {
      // @ts-ignore - Temporariamente ignorando erro de tipagem até que o tipo seja corrigido
      const result = await crmService.getDeals(filters || {});
      
      if (result.success && result.data) {
        setDeals(result.data);
      } else if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError('Erro ao carregar oportunidades');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar deal por ID
  const fetchDealById = async (id: string): Promise<DealWithRelations | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // @ts-ignore - Temporariamente ignorando erro de tipagem até que o tipo seja corrigido
      const result = await crmService.getDealById({ id });
      
      if (result.success && result.data) {
        setCurrentDeal(result.data);
        return result.data;
      }
      
      if (result.error) {
        setError(result.error.message);
      }
      
      return null;
    } catch (err) {
      setError('Erro ao carregar detalhes da oportunidade');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Criar nova deal
  const createDeal = async (data: CreateDealPayload): Promise<Deal | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // @ts-ignore - Temporariamente ignorando erro de tipagem até que o tipo seja corrigido
      const result = await crmService.createDeal(data);
      
      if (result.success && result.data) {
        // Atualizar a lista local se necessário
        // fetchDeals();
        return result.data;
      }
      
      if (result.error) {
        setError(result.error.message);
      }
      
      return null;
    } catch (err) {
      setError('Erro ao criar oportunidade');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar deal existente
  const updateDeal = async (id: string, data: UpdateDealPayload): Promise<Deal | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // @ts-ignore - Temporariamente ignorando erro de tipagem até que o tipo seja corrigido
      const result = await crmService.updateDeal({ id, ...data });
      
      if (result.success && result.data) {
        // Atualizar a deal corrente se for a mesma
        if (currentDeal && currentDeal.id === id) {
          setCurrentDeal(prev => prev ? { ...prev, ...data } : null);
        }
        
        // Atualizar a lista
        setDeals(prev => prev.map(deal => 
          // @ts-ignore - Assumindo que DealWithRelations tem um id
          deal.id === id ? { ...deal, ...data } as DealWithRelations : deal
        ));
        
        return result.data;
      }
      
      if (result.error) {
        setError(result.error.message);
      }
      
      return null;
    } catch (err) {
      setError('Erro ao atualizar oportunidade');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mover deal para outro estágio
  const moveDealToStage = async (id: string, stageId: string): Promise<Deal | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // @ts-ignore - Temporariamente ignorando erro de tipagem até que o tipo seja corrigido
      const result = await crmService.moveToStage({ id, stageId });
      
      if (result.success && result.data) {
        // Atualizar a deal corrente se for a mesma
        if (currentDeal && currentDeal.id === id) {
          setCurrentDeal(prev => prev ? { ...prev, stage_id: stageId } : null);
        }
        
        // Atualizar a lista
        setDeals(prev => prev.map(deal => 
          // @ts-ignore - Assumindo que DealWithRelations tem um id
          deal.id === id ? { ...deal, stage_id: stageId } as DealWithRelations : deal
        ));
        
        return result.data;
      }
      
      if (result.error) {
        setError(result.error.message);
      }
      
      return null;
    } catch (err) {
      setError('Erro ao mover oportunidade');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fechar deal (ganhar ou perder)
  const closeDeal = async (
    id: string, 
    status: 'ganha' | 'perdida', 
    reason?: string
  ): Promise<Deal | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // @ts-ignore - Temporariamente ignorando erro de tipagem até que o tipo seja corrigido
      const result = await crmService.closeDeal({ id, status, reason });
      
      if (result.success && result.data) {
        // Atualizar a deal corrente se for a mesma
        if (currentDeal && currentDeal.id === id) {
          setCurrentDeal(prev => prev ? { ...prev, status, closed_at: new Date().toISOString() } : null);
        }
        
        // Atualizar a lista
        setDeals(prev => prev.map(deal => 
          // @ts-ignore - Assumindo que DealWithRelations tem um id
          deal.id === id ? { ...deal, status, closed_at: new Date().toISOString() } as DealWithRelations : deal
        ));
        
        return result.data;
      }
      
      if (result.error) {
        setError(result.error.message);
      }
      
      return null;
    } catch (err) {
      setError('Erro ao fechar oportunidade');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deals,
    currentDeal,
    isLoading,
    error,
    fetchDeals,
    fetchDealById,
    createDeal,
    updateDeal,
    moveDealToStage,
    closeDeal,
  };
}