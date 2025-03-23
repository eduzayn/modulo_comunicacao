'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect, useRef } from 'react';

type WebVitalMetric = {
  id: string;
  name: string;
  label: 'web-vital' | 'custom';
  value: number;
};

/**
 * Função para enviar métricas para um serviço de analytics
 * 
 * @param metric A métrica de Web Vitals a ser enviada
 */
function sendToAnalytics(metric: WebVitalMetric): void {
  // Você pode substituir este console.log por uma chamada real ao seu serviço de analytics
  // como Google Analytics, Vercel Analytics, ou um endpoint personalizado
  if (process.env.NODE_ENV === 'production') {
    console.log('Web Vital:', metric);
    
    // Exemplo de envio para um endpoint personalizado
    // fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(metric),
    // });
    
    // Exemplo de envio para o Google Analytics (se estiver configurado)
    const analyticsId = 'UA-XXXXXXXX-X'; // Substitua pelo seu ID real
    if (window.gtag && analyticsId) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value),
        non_interaction: true,
      });
    }
  }
}

/**
 * Componente que monitora e relata métricas de Web Vitals
 * 
 * Este componente não renderiza nenhum elemento na UI, apenas coleta
 * e envia métricas de performance para análise.
 */
export function WebVitalsReporter(): null {
  const hasReported = useRef<Set<string>>(new Set());
  
  useReportWebVitals((metric) => {
    // Evitar relatórios duplicados de métricas com o mesmo ID
    if (hasReported.current.has(metric.id)) return;
    
    hasReported.current.add(metric.id);
    sendToAnalytics(metric);
  });
  
  // Relatórios adicionais quando o usuário deixa a página
  useEffect(() => {
    const reportVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Capture qualquer métrica final quando o usuário sai da página
        if ('getCLS' in window) {
          // @ts-ignore - getCLS é uma API experimental
          window.getCLS(sendToAnalytics);
        }
      }
    };
    
    document.addEventListener('visibilitychange', reportVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', reportVisibilityChange);
    };
  }, []);
  
  return null;
}

// Adicionar declaração global para gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params: {
        event_category: string;
        event_label: string;
        value: number;
        non_interaction: boolean;
        [key: string]: any;
      }
    ) => void;
  }
} 