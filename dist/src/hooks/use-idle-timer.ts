/**
 * use-idle-timer.ts
 * 
 * Hook para monitoramento de inatividade do usuário
 * Encerra a sessão do usuário após um período de inatividade
 * 
 * @module hooks
 * @created 2025-03-20
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface UseIdleTimerProps {
  timeout?: number; // Tempo em ms para considerar inatividade (padrão: 10 minutos)
  onIdle?: () => void; // Callback a ser executado quando o usuário ficar inativo
  onActive?: () => void; // Callback a ser executado quando o usuário voltar a ficar ativo
  events?: string[]; // Eventos a serem monitorados
  idleWarningTime?: number; // Tempo em ms para exibir aviso antes de logout (padrão: 1 minuto)
}

/**
 * Hook para monitoramento de inatividade do usuário
 * 
 * @param props Propriedades de configuração
 * @returns Objeto contendo estado de inatividade e métodos para controle
 */
export function useIdleTimer({
  timeout = 10 * 60 * 1000, // 10 minutos
  onIdle,
  onActive,
  events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'wheel', 'scroll'],
  idleWarningTime = 60 * 1000, // 1 minuto
}: UseIdleTimerProps = {}) {
  const [isIdle, setIsIdle] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeout);
  const lastActive = useRef(Date.now());
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Reinicia os timers e marca o usuário como ativo
  const resetTimers = useCallback(() => {
    lastActive.current = Date.now();
    setTimeRemaining(timeout);
    setIsIdle(false);
    setIsWarning(false);

    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }

    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
      warningTimer.current = null;
    }

    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
    }

    // Configurar timer de aviso
    warningTimer.current = setTimeout(() => {
      setIsWarning(true);
      toast({
        title: 'Aviso de inatividade',
        description: `Sua sessão será encerrada em ${Math.floor(idleWarningTime / 1000)} segundos devido a inatividade.`,
        duration: idleWarningTime,
      });

      // Iniciar contagem regressiva
      countdownTimer.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newValue = prev - 1000;
          if (newValue <= 0) {
            if (countdownTimer.current) {
              clearInterval(countdownTimer.current);
            }
          }
          return newValue;
        });
      }, 1000);

    }, timeout - idleWarningTime);

    // Configurar timer de inatividade
    idleTimer.current = setTimeout(() => {
      setIsIdle(true);
      if (onIdle) {
        onIdle();
      }
      
      // Redirecionar para login ou realizar logout
      localStorage.removeItem('auth_user');
      toast({
        title: 'Sessão encerrada',
        description: 'Sua sessão foi encerrada devido a inatividade.',
        duration: 5000,
      });
      router.push('/login');
    }, timeout);

    if (onActive && isIdle) {
      onActive();
    }
  }, [timeout, onIdle, onActive, toast, router, isIdle, idleWarningTime]);

  // Configurar event listeners
  useEffect(() => {
    // Inicializar timers
    resetTimers();

    // Função para lidar com eventos
    const handleEvents = () => {
      resetTimers();
    };

    // Registrar event listeners
    events.forEach(event => {
      window.addEventListener(event, handleEvents);
    });

    // Limpar event listeners e timers ao desmontar
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleEvents);
      });

      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }

      if (warningTimer.current) {
        clearTimeout(warningTimer.current);
      }

      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
      }
    };
  }, [resetTimers, events]);

  // Função para forçar manualmente a reinicialização dos timers
  const activate = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  // Função para forçar manualmente a inatividade
  const pause = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }

    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
    }

    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
    }

    setIsIdle(true);
    if (onIdle) {
      onIdle();
    }
  }, [onIdle]);

  return {
    isIdle,
    isWarning,
    timeRemaining,
    activate,
    pause,
    lastActive: lastActive.current,
  };
} 