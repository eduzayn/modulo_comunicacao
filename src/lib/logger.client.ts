/**
 * Client-side logger implementation
 * 
 * This provides a browser-compatible version of the logger
 * with the same API as the server-side logger.
 */

'use client';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

/**
 * Client-side logger class
 */
class ClientLogger {
  private context: Record<string, unknown> = {};
  private static instance: ClientLogger;

  /**
   * Get the singleton instance of the logger
   */
  public static getInstance(): ClientLogger {
    if (!ClientLogger.instance) {
      ClientLogger.instance = new ClientLogger();
    }
    return ClientLogger.instance;
  }

  /**
   * Set context data that will be included with all log entries
   */
  setContext(context: Record<string, unknown>): ClientLogger {
    this.context = { ...this.context, ...context };
    return this;
  }

  /**
   * Clear all context data
   */
  clearContext(): ClientLogger {
    this.context = {};
    return this;
  }

  /**
   * Internal method to create and process a log entry
   */
  private log(level: LogLevel, message: string, additionalContext?: Record<string, unknown>): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...additionalContext },
    };

    // Only log in development or when debug is enabled
    if (process.env.NODE_ENV === 'development' || localStorage.getItem('debug') === 'true') {
      const logMethod = 
        level === 'error' ? console.error : 
        level === 'warn' ? console.warn : 
        level === 'info' ? console.info : 
        console.debug;
      
      logMethod(
        `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, 
        Object.keys(entry.context || {}).length > 0 ? entry.context : ''
      );
    }

    return entry;
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, unknown>): LogEntry {
    return this.log('debug', message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, unknown>): LogEntry {
    return this.log('info', message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, unknown>): LogEntry {
    return this.log('warn', message, context);
  }

  /**
   * Log an error message with optional Error object
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): LogEntry {
    return this.log('error', message, {
      ...context,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : undefined,
    });
  }

  /**
   * Create a child logger with additional context
   */
  child(childContext: Record<string, unknown>): ClientLogger {
    const childLogger = new ClientLogger();
    childLogger.setContext({
      ...this.context,
      ...childContext,
    });
    return childLogger;
  }

  /**
   * Log a performance measurement
   */
  performance(label: string, durationMs: number, context?: Record<string, unknown>): LogEntry {
    return this.log('info', `Performance: ${label}`, {
      ...context,
      performance: {
        label,
        durationMs,
      },
    });
  }

  /**
   * Start a performance measurement
   */
  startPerformanceMeasurement(label: string): () => LogEntry {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const durationMs = endTime - startTime;
      return this.performance(label, durationMs);
    };
  }

  /**
   * Log a client-side API request
   */
  logApiRequest(
    method: string, 
    url: string, 
    statusCode?: number, 
    durationMs?: number, 
    context?: Record<string, unknown>
  ): LogEntry {
    return this.log('info', `API ${method} ${url}`, {
      ...context,
      api: {
        method,
        url,
        statusCode,
        durationMs,
      },
    });
  }
}

// Export a singleton instance
export const clientLogger = ClientLogger.getInstance();

// Export a higher-order function for measuring performance
export function withClientPerformanceLogging<T extends (...args: unknown[]) => any>(
  fn: T,
  label: string
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const end = clientLogger.startPerformanceMeasurement(label);
    const result = fn(...args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result
        .then((value) => {
          end();
          return value;
        })
        .catch((error) => {
          end();
          throw error;
        }) as ReturnType<T>;
    }
    
    end();
    return result;
  };
}
