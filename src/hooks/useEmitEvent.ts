'use client'

import { useState } from 'react'
import { EventType } from '@/lib/events'

/**
 * Hook para emissão de eventos internos a partir de componentes React
 * 
 * Este hook simplifica a emissão de eventos na interface do usuário,
 * gerenciando estados de carregamento e erros.
 */
export function useEmitEvent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastEmittedEvent, setLastEmittedEvent] = useState<{
    type: string,
    success: boolean,
    timestamp: string
  } | null>(null)

  /**
   * Emite um evento interno através da API
   */
  const emitEvent = async (
    eventType: EventType,
    payload: Record<string, any>,
    options?: {
      source?: string,
      apiKey?: string
    }
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/internal/emit-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventType,
          payload,
          source: options?.source || 'ui',
          apiKey: options?.apiKey
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao emitir evento')
      }
      
      // Registrar o evento emitido com sucesso
      setLastEmittedEvent({
        type: eventType,
        success: true,
        timestamp: new Date().toISOString()
      })
      
      return { success: true, data }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setError(errorMessage)
      
      // Registrar o evento com falha
      setLastEmittedEvent({
        type: eventType,
        success: false,
        timestamp: new Date().toISOString()
      })
      
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }
  
  /**
   * Limpa o estado de erro
   */
  const clearError = () => {
    setError(null)
  }
  
  /**
   * Limpa o registro do último evento emitido
   */
  const clearLastEmittedEvent = () => {
    setLastEmittedEvent(null)
  }
  
  return {
    emitEvent,
    isLoading,
    error,
    lastEmittedEvent,
    clearError,
    clearLastEmittedEvent
  }
}

export default useEmitEvent 