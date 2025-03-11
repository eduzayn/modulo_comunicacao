export interface MetricData {
  type: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: string;
}

/**
 * Registra uma métrica no sistema
 */
export async function recordMetric(data: MetricData): Promise<void> {
  try {
    // Adiciona timestamp se não fornecido
    const metric = {
      ...data,
      timestamp: data.timestamp || new Date().toISOString()
    };
    
    // Log da métrica (implementação temporária)
    console.log(`Metric recorded: ${metric.type}, Value: ${metric.value}`, 
      metric.tags ? `Tags: ${JSON.stringify(metric.tags)}` : '');
    
    // Em uma implementação real, enviaríamos para um serviço de métricas
    // ou armazenaríamos no banco de dados
  } catch (error) {
    console.error('Error recording metric:', error);
  }
}

/**
 * Registra uma chamada de API
 */
export async function recordApiCall(name: string, duration: number): Promise<void> {
  await recordMetric({
    type: 'api_call',
    value: duration,
    tags: { name }
  });
}

export const metrics = {
  recordApiCall
};

export default metrics;
