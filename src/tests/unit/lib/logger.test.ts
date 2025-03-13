import { LogLevel, logger } from '../../lib/logger';

describe('Logger', () => {
  let originalConsole: Console;
  let mockConsole: { [key: string]: jest.Mock };

  beforeEach(() => {
    // Save original console
    originalConsole = global.console;
    
    // Create mock console
    mockConsole = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };
    
    // Replace global console with mock
    global.console = mockConsole as unknown as Console;
  });

  afterEach(() => {
    // Restore original console
    global.console = originalConsole;
  });

  it('should log messages with the correct level', () => {
    // Test debug level
    logger.debug('Debug message');
    expect(mockConsole.debug).toHaveBeenCalledWith(
      expect.stringContaining('DEBUG'),
      'Debug message'
    );
    
    // Test info level
    logger.info('Info message');
    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringContaining('INFO'),
      'Info message'
    );
    
    // Test warn level
    logger.warn('Warning message');
    expect(mockConsole.warn).toHaveBeenCalledWith(
      expect.stringContaining('WARN'),
      'Warning message'
    );
    
    // Test error level
    logger.error('Error message');
    expect(mockConsole.error).toHaveBeenCalledWith(
      expect.stringContaining('ERROR'),
      'Error message'
    );
  });

  it('should include additional context in log messages', () => {
    const context = { userId: '123', action: 'login' };
    
    logger.info('User action', context);
    
    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringContaining('INFO'),
      'User action',
      context
    );
  });

  it('should format error objects properly', () => {
    const error = new Error('Test error');
    
    logger.error('An error occurred', { error });
    
    expect(mockConsole.error).toHaveBeenCalledWith(
      expect.stringContaining('ERROR'),
      'An error occurred',
      expect.objectContaining({
        error: expect.objectContaining({
          message: 'Test error',
        }),
      })
    );
  });
});
