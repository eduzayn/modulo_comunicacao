import { withErrorHandling, withAuthentication, withLogging } from '@/lib/api-middleware';
import { createErrorResponse } from '@/lib/api-response';
import { NextRequest, NextResponse } from 'next/server';

// Mock dependencies
jest.mock('@/lib/api-response', () => ({
  createErrorResponse: jest.fn(),
  createSuccessResponse: jest.fn(),
}));

jest.mock('@/lib/auth/authenticate', () => ({
  authenticate: jest.fn(),
}));

jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('API Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('withErrorHandling', () => {
    it('should handle successful requests', async () => {
      // Setup
      const mockHandler = jest.fn().mockResolvedValue(NextResponse.json({ success: true }));
      const wrappedHandler = withErrorHandling(mockHandler);
      const mockRequest = new NextRequest(new Request('https://example.com'));
      
      // Execute
      const response = await wrappedHandler(mockRequest);
      
      // Verify
      expect(mockHandler).toHaveBeenCalledWith(mockRequest);
      expect(response.status).toBe(200);
    });
    
    it('should handle errors thrown by the handler', async () => {
      // Setup
      const mockError = new Error('Test error');
      const mockHandler = jest.fn().mockRejectedValue(mockError);
      const wrappedHandler = withErrorHandling(mockHandler);
      const mockRequest = new NextRequest(new Request('https://example.com'));
      
      createErrorResponse.mockReturnValue({
        response: { success: false, error: 'Test error' },
        status: 500,
      });
      
      // Execute
      const response = await wrappedHandler(mockRequest);
      
      // Verify
      expect(mockHandler).toHaveBeenCalledWith(mockRequest);
      expect(createErrorResponse).toHaveBeenCalledWith(mockError);
      expect(response.status).toBe(500);
    });
    
    it('should handle errors with custom status codes', async () => {
      // Setup
      const mockError = new Error('Not found');
      mockError.status = 404;
      
      const mockHandler = jest.fn().mockRejectedValue(mockError);
      const wrappedHandler = withErrorHandling(mockHandler);
      const mockRequest = new NextRequest(new Request('https://example.com'));
      
      createErrorResponse.mockReturnValue({
        response: { success: false, error: 'Not found' },
        status: 404,
      });
      
      // Execute
      const response = await wrappedHandler(mockRequest);
      
      // Verify
      expect(mockHandler).toHaveBeenCalledWith(mockRequest);
      expect(createErrorResponse).toHaveBeenCalledWith(mockError);
      expect(response.status).toBe(404);
    });
  });
  
  describe('withAuthentication', () => {
    it('should pass authenticated requests to the handler', async () => {
      // Setup
      const mockHandler = jest.fn().mockResolvedValue(NextResponse.json({ success: true }));
      const wrappedHandler = withAuthentication(mockHandler);
      const mockRequest = new NextRequest(new Request('https://example.com'));
      
      import { authenticate } from '@/lib/auth/authenticate';
      authenticate.mockResolvedValue({ userId: 'user-1', role: 'admin' });
      
      // Execute
      const response = await wrappedHandler(mockRequest);
      
      // Verify
      expect(authenticate).toHaveBeenCalledWith(mockRequest);
      expect(mockHandler).toHaveBeenCalledWith(mockRequest, { userId: 'user-1', role: 'admin' });
      expect(response.status).toBe(200);
    });
    
    it('should reject unauthenticated requests', async () => {
      // Setup
      const mockHandler = jest.fn();
      const wrappedHandler = withAuthentication(mockHandler);
      const mockRequest = new NextRequest(new Request('https://example.com'));
      
      import { authenticate } from '@/lib/auth/authenticate';
      authenticate.mockRejectedValue(new Error('Unauthorized'));
      
      createErrorResponse.mockReturnValue({
        response: { success: false, error: 'Unauthorized' },
        status: 401,
      });
      
      // Execute
      const response = await wrappedHandler(mockRequest);
      
      // Verify
      expect(authenticate).toHaveBeenCalledWith(mockRequest);
      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });
  
  describe('withLogging', () => {
    it('should log successful requests', async () => {
      // Setup
      const mockHandler = jest.fn().mockResolvedValue(NextResponse.json({ success: true }));
      const wrappedHandler = withLogging(mockHandler);
      const mockRequest = new NextRequest(new Request('https://example.com/api/test'));
      
      import { logger } from '@/lib/logger';
      
      // Execute
      const response = await wrappedHandler(mockRequest);
      
      // Verify
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Request to /api/test'));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Response from /api/test'));
      expect(mockHandler).toHaveBeenCalledWith(mockRequest);
      expect(response.status).toBe(200);
    });
    
    it('should log failed requests', async () => {
      // Setup
      const mockError = new Error('Test error');
      const mockHandler = jest.fn().mockRejectedValue(mockError);
      const wrappedHandler = withLogging(mockHandler);
      const mockRequest = new NextRequest(new Request('https://example.com/api/test'));
      
      import { logger } from '@/lib/logger';
      
      // Execute
      await expect(wrappedHandler(mockRequest)).rejects.toThrow('Test error');
      
      // Verify
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Request to /api/test'));
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error in /api/test'), mockError);
      expect(mockHandler).toHaveBeenCalledWith(mockRequest);
    });
  });
});
