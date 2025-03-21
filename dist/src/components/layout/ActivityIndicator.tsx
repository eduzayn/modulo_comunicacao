'use client'

/**
 * ActivityIndicator.tsx
 * 
 * Componente para exibir o status da contagem de horas e tempo de atividade
 * 
 * @module components/layout
 * @created 2025-03-20
 */

import React, { useState, useEffect } from 'react'
import { useActivity } from '@/contexts/ActivityContext'
import { Clock, PlayCircle, PauseCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ActivityIndicatorProps {
  className?: string
}

export function ActivityIndicator({ className }: ActivityIndicatorProps) {
  const { 
    isActive, 
    isIdle, 
    isTracking, 
    currentTimeEntry,
    timeRemaining,
    startTracking,
    pauseTracking,
    resumeTracking 
  } = useActivity()
  
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00')
  const [progressValue, setProgressValue] = useState(100)
  
  // Atualizar tempo decorrido
  useEffect(() => {
    let intervalId: NodeJS.Timeout
    
    if (isTracking && currentTimeEntry) {
      intervalId = setInterval(() => {
        const startTime = new Date(currentTimeEntry.start_time).getTime()
        const now = Date.now()
        const elapsed = now - startTime
        
        // Formatação em hh:mm:ss
        const hours = Math.floor(elapsed / (1000 * 60 * 60))
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)
        
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        )
      }, 1000)
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isTracking, currentTimeEntry])
  
  // Atualizar barra de progresso
  useEffect(() => {
    if (isActive && !isIdle) {
      setProgressValue(Math.min(100, (timeRemaining / (10 * 60 * 1000)) * 100))
    } else {
      setProgressValue(0)
    }
  }, [isActive, isIdle, timeRemaining])
  
  // Iniciar contagem para teste
  const handleStartTracking = async () => {
    await startTracking('Desenvolvimento', 'Trabalhando no sistema de comunicação')
  }
  
  return (
    <Card className={`border shadow-sm ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Status de Atividade</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {isTracking ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={pauseTracking}
                    >
                      <PauseCircle className="h-4 w-4 text-amber-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pausar contagem</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={handleStartTracking}
                    >
                      <PlayCircle className="h-4 w-4 text-green-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Iniciar contagem</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className={`${isActive ? 'text-green-500' : 'text-muted-foreground'}`}>
              {isActive ? 'Ativo' : 'Inativo'}
            </span>
            {isTracking && (
              <span className="font-medium">{elapsedTime}</span>
            )}
          </div>
          
          <Progress value={progressValue} className="h-1" />
          
          {isTracking && currentTimeEntry && (
            <div className="text-xs text-muted-foreground mt-1">
              <span>
                Iniciado há {formatDistanceToNow(new Date(currentTimeEntry.start_time), { locale: ptBR })}
              </span>
            </div>
          )}
          
          {isIdle && (
            <div className="flex items-center mt-1 text-xs text-amber-500">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>Inatividade detectada</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 