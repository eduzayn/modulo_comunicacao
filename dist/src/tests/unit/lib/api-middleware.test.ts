import { NextRequest, NextResponse } from 'next/server';
import { withApiMiddleware } from '../../lib/api-middleware';
import { logger } from '../../lib/logger';

// Mock the logger
jest.mock('../../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('API Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass through requests when handler succeeds', async () => {
    // Create a mock handler that returns a successful response
    const mockHandler = jest.fn().mockResolvedValue(
      NextResponse.json({ success: true })
    );

    // Create a mock request
    const mockRequest = new NextRequest(new Request('https://example.com/api/test'));

    // Apply the middleware
    const wrappedHandler = withApiMiddleware(mockHandler);
    const response = await wrappedHandler(mockRequest);

    // Check that the handler was called
    expect(mockHandler).toHaveBeenCalledWith(mockRequest);

    // Check that the response is correct
    const responseData = await response.json();
    expect(responseData).toEqual({ success: true });

    // Check that the logger was called
    expect(logger.info).toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should handle errors and return error response', async () => {
    // Create a mock handler that throws an error
    const mockError = new Error('Test error');
    const mockHandler = jest.fn().mockRejectedValue(mockError);

    // Create a mock request
    const mockRequest = new NextRequest(new Request('https://example.com/api/test'));

    // Apply the middleware
    const wrappedHandler = withApiMiddleware(mockHandler);
    const response = await wrappedHandler(mockRequest);

    // Check that the handler was called
    expect(mockHandler).toHaveBeenCalledWith(mockRequest);

    // Check that the response is an error response
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: 'Test error',
    });
    expect(response.status).toBe(500);

    // Check that the logger was called with the error
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('API error'),
      expect.objectContaining({
        error: mockError,
        url: 'https://example.com/api/test',
      })
    );
  });

  it('should handle validation errors', async () => {
    // Create a validation error
    const validationError = new Error('Validation failed');
    // Add a status property to simulate a validation error
    Object.defineProperty(validationError, 'status', {
      value: 400,
    });

    // Create a mock handler that throws the validation error
    const mockHandler = jest.fn().mockRejectedValue(validationError);

    // Create a mock request
    const mockRequest = new NextRequest(new Request('https://example.com/api/test'));

    // Apply the middleware
    const wrappedHandler = withApiMiddleware(mockHandler);
    const response = await wrappedHandler(mockRequest);

    // Check that the response has the correct status
    expect(response.status).toBe(400);

    // Check that the response contains the error message
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: 'Validation failed',
    });

    // Check that the logger was called
    expect(logger.info).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
  });

  it('should add CORS headers to the response', async () => {
    // Create a mock handler that returns a successful response
    const mockHandler = jest.fn().mockResolvedValue(
      NextResponse.json({ success: true })
    );

    // Create a mock request with origin header
    const mockRequest = new NextRequest(new Request('https://example.com/api/test', {
      headers: {
        origin: 'https://client-app.com',
      },
    }));

    // Apply the middleware
    const wrappedHandler = withApiMiddleware(mockHandler);
    const response = await wrappedHandler(mockRequest);

    // Check that CORS headers are added
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe(
      'Content-Type, Authorization'
    );
  });
});
