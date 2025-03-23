import { supabase } from '../lib/supabase';

export interface QueueJob {
  id?: string;
  type: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  attempts: number;
  max_attempts: number;
  result?: any;
  error?: string;
  created_at?: string;
  updated_at?: string;
  started_at?: string;
  completed_at?: string;
}

/**
 * Adiciona um job à fila de processamento
 */
export async function enqueue(type: string, payload: any, priority: number = 5): Promise<QueueJob> {
  try {
    // Implementação temporária para resolver erro de build
    console.log(`Enqueuing job: ${type}, Priority: ${priority}`);
    
    // Retorna um job simulado
    return {
      id: crypto.randomUUID(),
      type,
      payload,
      status: 'pending',
      priority,
      attempts: 0,
      max_attempts: 3,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error enqueueing job:', error);
    throw error;
  }
}

/**
 * Processa jobs pendentes na fila
 */
export async function processQueue(): Promise<number> {
  // Implementação temporária para resolver erro de build
  console.log('Processing queue jobs');
  return 0;
}

// Registro de processadores de jobs
const processors: Record<string, (job: QueueJob) => Promise<any>> = {};

/**
 * Registra um processador para um tipo específico de job
 */
export function registerProcessor(type: string, processor: (job: QueueJob) => Promise<any>) {
  processors[type] = processor;
}

export default {
  enqueue,
  processQueue,
  registerProcessor
};
