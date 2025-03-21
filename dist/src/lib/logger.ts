/**
 * Logger simplificado para o sistema de comunicação
 * 
 * Esta implementação permite enviar logs para diferentes destinos
 * (console, arquivo, serviço externo) com níveis de severidade
 */

// Níveis de severidade do log
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// Interface para o metadado do log
export interface LogMetadata {
  [key: string]: any
}

// Configuração global do logger
const logConfig = {
  minLevel: (process.env.LOG_LEVEL || 'info') as LogLevel,
  enableConsole: process.env.ENABLE_CONSOLE_LOGS !== 'false',
  enableFile: process.env.ENABLE_FILE_LOGS === 'true',
  enableService: process.env.ENABLE_SERVICE_LOGS === 'true',
  serviceUrl: process.env.LOG_SERVICE_URL,
  appName: process.env.APP_NAME || 'communication-module',
  environment: process.env.NODE_ENV || 'development'
}

// Mapeamento de níveis para valores numéricos para comparação
const logLevelValues: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

/**
 * Formata uma mensagem de log com metadados
 */
function formatLogMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
  const timestamp = new Date().toISOString()
  const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metadataStr}`
}

/**
 * Determina se um log de determinado nível deve ser registrado
 * com base na configuração global
 */
function shouldLog(level: LogLevel): boolean {
  return logLevelValues[level] >= logLevelValues[logConfig.minLevel]
}

/**
 * Envia um log para o console (stdout/stderr)
 */
function logToConsole(level: LogLevel, message: string, metadata?: LogMetadata): void {
  if (!logConfig.enableConsole) return

  const formattedMessage = formatLogMessage(level, message, metadata)
  
  if (level === 'error') {
    console.error(formattedMessage)
  } else if (level === 'warn') {
    console.warn(formattedMessage)
  } else {
    console.log(formattedMessage)
  }
}

/**
 * Envia um log para um arquivo
 * (implementação simplificada)
 */
function logToFile(level: LogLevel, message: string, metadata?: LogMetadata): void {
  if (!logConfig.enableFile) return
  
  // Esta é uma função de placeholder
  // Em uma implementação real, usaríamos um sistema de logging como winston
  // para escrever em arquivos com rotação, etc.
  console.log(`[FILE LOG] ${formatLogMessage(level, message, metadata)}`)
}

/**
 * Envia um log para um serviço externo
 * (implementação simplificada)
 */
function logToService(level: LogLevel, message: string, metadata?: LogMetadata): void {
  if (!logConfig.enableService || !logConfig.serviceUrl) return

  // Esta é uma função de placeholder
  // Em uma implementação real, faríamos uma requisição HTTP para um serviço de logs
  // como Sentry, LogRocket, Datadog, etc.
  const logData = {
    level,
    message,
    metadata,
    timestamp: new Date().toISOString(),
    app: logConfig.appName,
    environment: logConfig.environment,
  }
  
  // Implementação real enviaria para o serviço
  // fetch(logConfig.serviceUrl, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(logData),
  // }).catch(err => console.error('Erro ao enviar log para serviço:', err));
  
  console.log(`[SERVICE LOG] Would send: ${JSON.stringify(logData)}`)
}

/**
 * Função principal de logging que distribui para os diferentes destinos
 */
function log(level: LogLevel, message: string, metadata?: LogMetadata): void {
  if (!shouldLog(level)) return
  
  logToConsole(level, message, metadata)
  logToFile(level, message, metadata)
  logToService(level, message, metadata)
}

/**
 * API pública do logger
 */
export const logger = {
  debug: (message: string, metadata?: LogMetadata) => log('debug', message, metadata),
  info: (message: string, metadata?: LogMetadata) => log('info', message, metadata),
  warn: (message: string, metadata?: LogMetadata) => log('warn', message, metadata),
  error: (message: string, metadata?: LogMetadata) => log('error', message, metadata)
}

export default logger
