/**
 * ActivityContext.tsx
 * 
 * Context provider para gerenciar a atividade do usuário e contagem de horas
 * 
 * @module contexts
 * @created 2025-03-20
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useIdleTimer } from '@/hooks/use-idle-timer';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { 
  startTimeTracking,
  pauseTimeTracking,
  resumeTimeTracking,
  getActiveTimeEntry,
  TimeEntry
} from '@/services/timeTracking';

// Tipos
interface ActivityContextType {
  isActive: boolean;
  isIdle: boolean;
  isTracking: boolean;
  currentTimeEntry: TimeEntry | null;
  timeRemaining: number;
  startTracking: (category: string, taskDescription?: string, sectorId?: string, roleId?: string) => Promise<boolean>;
  pauseTracking: () => Promise<boolean>;
  resumeTracking: () => Promise<boolean>;
}

interface ActivityProviderProps {
  children: ReactNode;
  userId?: string;
}

// Criar contexto
const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

/**
 * Provider para gerenciar atividade do usuário
 */
export function ActivityProvider({ children, userId }: ActivityProviderProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTimeEntry, setCurrentTimeEntry] = useState<TimeEntry | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Configurar monitoramento de inatividade
  const { 
    isIdle, 
    isWarning,
    timeRemaining,
    activate,
    pause
  } = useIdleTimer({
    timeout: 10 * 60 * 1000, // 10 minutos
    onIdle: async () => {
      // Pausar contagem de horas quando ficar inativo
      if (isTracking && currentTimeEntry) {
        const result = await pauseTimeTracking(currentTimeEntry.id);
        if (result) {
          setIsTracking(false);
          setCurrentTimeEntry(null);
          toast({
            title: 'Contagem de horas pausada',
            description: 'A contagem de horas foi pausada devido à inatividade.',
            duration: 5000,
          });
        }
      }
    }
  });

  // Verificar se há uma contagem de horas ativa ao iniciar
  useEffect(() => {
    async function checkActiveTimeEntry() {
      if (!userId) return;
      
      try {
        const activeEntry = await getActiveTimeEntry(userId);
        if (activeEntry) {
          setIsTracking(true);
          setCurrentTimeEntry(activeEntry);
          toast({
            title: 'Contagem de horas ativa',
            description: 'Há uma contagem de horas em andamento.',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar contagem de horas ativa:', error);
      }
    }
    
    checkActiveTimeEntry();
  }, [userId, toast]);

  /**
   * Iniciar contagem de horas
   */
  const startTracking = async (
    category: string,
    taskDescription?: string,
    sectorId?: string,
    roleId?: string
  ): Promise<boolean> => {
    if (!userId) {
      toast({
        title: 'Erro',
        description: 'Usuário não autenticado.',
        variant: 'destructive',
        duration: 3000,
      });
      return false;
    }
    
    try {
      // Verificar se já existe uma contagem ativa
      if (isTracking) {
        toast({
          title: 'Contagem já iniciada',
          description: 'Já existe uma contagem de horas em andamento.',
          duration: 3000,
        });
        return false;
      }
      
      // Iniciar nova contagem
      const result = await startTimeTracking(
        userId,
        category,
        taskDescription,
        sectorId,
        roleId
      );
      
      if (result) {
        setIsTracking(true);
        setCurrentTimeEntry(result);
        activate(); // Reiniciar timer de inatividade
        
        toast({
          title: 'Contagem iniciada',
          description: 'A contagem de horas foi iniciada com sucesso.',
          duration: 3000,
        });
        
        return true;
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível iniciar a contagem de horas.',
          variant: 'destructive',
          duration: 3000,
        });
        
        return false;
      }
    } catch (error) {
      console.error('Erro ao iniciar contagem:', error);
      
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao iniciar a contagem de horas.',
        variant: 'destructive',
        duration: 3000,
      });
      
      return false;
    }
  };

  /**
   * Pausar contagem de horas
   */
  const pauseTracking = async (): Promise<boolean> => {
    if (!isTracking || !currentTimeEntry) {
      toast({
        title: 'Erro',
        description: 'Não há uma contagem de horas em andamento.',
        variant: 'destructive',
        duration: 3000,
      });
      return false;
    }
    
    try {
      const result = await pauseTimeTracking(currentTimeEntry.id);
      
      if (result) {
        setIsTracking(false);
        setCurrentTimeEntry(null);
        
        toast({
          title: 'Contagem pausada',
          description: 'A contagem de horas foi pausada com sucesso.',
          duration: 3000,
        });
        
        return true;
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível pausar a contagem de horas.',
          variant: 'destructive',
          duration: 3000,
        });
        
        return false;
      }
    } catch (error) {
      console.error('Erro ao pausar contagem:', error);
      
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao pausar a contagem de horas.',
        variant: 'destructive',
        duration: 3000,
      });
      
      return false;
    }
  };

  /**
   * Retomar contagem de horas
   */
  const resumeTracking = async (): Promise<boolean> => {
    if (!userId || !currentTimeEntry) {
      toast({
        title: 'Erro',
        description: 'Não é possível retomar a contagem de horas.',
        variant: 'destructive',
        duration: 3000,
      });
      return false;
    }
    
    if (isTracking) {
      toast({
        title: 'Contagem já iniciada',
        description: 'Já existe uma contagem de horas em andamento.',
        duration: 3000,
      });
      return false;
    }
    
    try {
      const result = await resumeTimeTracking(userId, currentTimeEntry.id);
      
      if (result) {
        setIsTracking(true);
        setCurrentTimeEntry(result);
        activate(); // Reiniciar timer de inatividade
        
        toast({
          title: 'Contagem retomada',
          description: 'A contagem de horas foi retomada com sucesso.',
          duration: 3000,
        });
        
        return true;
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível retomar a contagem de horas.',
          variant: 'destructive',
          duration: 3000,
        });
        
        return false;
      }
    } catch (error) {
      console.error('Erro ao retomar contagem:', error);
      
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao retomar a contagem de horas.',
        variant: 'destructive',
        duration: 3000,
      });
      
      return false;
    }
  };

  // Valor do contexto
  const value: ActivityContextType = {
    isActive: !isIdle,
    isIdle,
    isTracking,
    currentTimeEntry,
    timeRemaining,
    startTracking,
    pauseTracking,
    resumeTracking,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

/**
 * Hook para usar o contexto de atividade
 */
export function useActivity() {
  const context = useContext(ActivityContext);
  
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  
  return context;
} 