import { logger, LogLevel } from '@/lib/logger';

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

describe('Logger', () => {
  beforeEach(() => {
    // Mock console methods
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    
    // Reset log level before each test
    process.env.LOG_LEVEL = 'info';
  });
  
  afterEach(() => {
    // Restore console methods
    console.log = originalConsoleLog;
    console.info = originalConsoleInfo;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
    
    // Reset environment variables
    delete process.env.LOG_LEVEL;
  });
  
  it('should log at debug level when LOG_LEVEL is debug', () => {
    process.env.LOG_LEVEL = 'debug';
    
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');
    
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[DEBUG]'), 'Debug message');
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('[INFO]'), 'Info message');
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[WARN]'), 'Warning message');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'), 'Error message');
  });
  
  it('should not log debug when LOG_LEVEL is info', () => {
    process.env.LOG_LEVEL = 'info';
    
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');
    
    expect(console.log).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('[INFO]'), 'Info message');
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[WARN]'), 'Warning message');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'), 'Error message');
  });
  
  it('should only log errors when LOG_LEVEL is error', () => {
    process.env.LOG_LEVEL = 'error';
    
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');
    
    expect(console.log).not.toHaveBeenCalled();
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'), 'Error message');
  });
  
  it('should format error objects properly', () => {
    const error = new Error('Test error');
    
    logger.error('An error occurred', error);
    
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR]'),
      'An error occurred',
      error
    );
  });
  
  it('should include context data in logs', () => {
    const context = { userId: '123', action: 'login' };
    
    logger.info('User action', context);
    
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]'),
      'User action',
      context
    );
  });
  
  it('should handle multiple arguments', () => {
    logger.info('Message with', 'multiple', 'arguments');
    
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]'),
      'Message with',
      'multiple',
      'arguments'
    );
  });
});
