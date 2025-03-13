/**
 * Structured logging service for better error tracking and debugging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

/**
 * Logger class for structured logging with context support
 */
class Logger {
  private context: Record<string, unknown> = {};
  private static instance: Logger;

  /**
   * Get the singleton instance of the logger
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Set context data that will be included with all log entries
   */
  setContext(context: Record<string, unknown>): Logger {
    this.context = { ...this.context, ...context };
    return this;
  }

  /**
   * Clear all context data
   */
  clearContext(): Logger {
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

    // Development logging to console
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
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

    // Production logging
    if (process.env.NODE_ENV === 'production') {
      // In a real implementation, we would send logs to a service like Sentry, Datadog, etc.
      // For now, we'll just log to console in a more structured format
      if (level === 'error' || level === 'warn') {
        console.error(JSON.stringify(entry));
      }
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
  child(childContext: Record<string, unknown>): Logger {
    const childLogger = new Logger();
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
   * Log an API request
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

  /**
   * Log a database operation
   */
  logDbOperation(
    operation: string, 
    table: string, 
    durationMs?: number, 
    context?: Record<string, unknown>
  ): LogEntry {
    return this.log('info', `DB ${operation} ${table}`, {
      ...context,
      database: {
        operation,
        table,
        durationMs,
      },
    });
  }
}

// Export a singleton instance
export const logger = Logger.getInstance();

// Export a middleware for logging API requests
export function loggerMiddleware(req: Request, res: Response, next: () => void) {
  const startTime = performance.now();
  
  // Add response finished listener
  res.on('finish', () => {
    const durationMs = performance.now() - startTime;
    
    logger.logApiRequest(
      req.method,
      req.url,
      res.statusCode,
      durationMs,
      {
        requestId: req.headers['x-request-id'],
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      }
    );
  });
  
  next();
}

// Export a higher-order function for measuring performance
export function withPerformanceLogging<T extends (...args: unknown[]) => any>(
  fn: T,
  label: string
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const end = logger.startPerformanceMeasurement(label);
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
