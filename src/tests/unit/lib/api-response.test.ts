import { createSuccessResponse, createErrorResponse, HttpStatus } from '@/lib/api-response';

describe('API Response Utilities', () => {
  beforeEach(() => {
    // Mock Date.now() to return a consistent timestamp for testing
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2025-03-10T12:00:00.000Z');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createSuccessResponse', () => {
    it('should create a properly formatted success response', () => {
      const data = { id: '123', name: 'Test Item' };
      const response = createSuccessResponse(data);

      expect(response).toEqual({
        success: true,
        data: { id: '123', name: 'Test Item' },
        timestamp: '2025-03-10T12:00:00.000Z',
      });
    });

    it('should handle null data', () => {
      const response = createSuccessResponse(null);

      expect(response).toEqual({
        success: true,
        data: null,
        timestamp: '2025-03-10T12:00:00.000Z',
      });
    });

    it('should handle array data', () => {
      const data = [{ id: '1' }, { id: '2' }];
      const response = createSuccessResponse(data);

      expect(response).toEqual({
        success: true,
        data: [{ id: '1' }, { id: '2' }],
        timestamp: '2025-03-10T12:00:00.000Z',
      });
    });
  });

  describe('createErrorResponse', () => {
    it('should create a properly formatted error response with default status', () => {
      const { response, status } = createErrorResponse('Something went wrong');

      expect(response).toEqual({
        success: false,
        error: 'Something went wrong',
        timestamp: '2025-03-10T12:00:00.000Z',
      });
      expect(status).toBe(500);
    });

    it('should create an error response with custom status code', () => {
      const { response, status } = createErrorResponse('Not found', 404);

      expect(response).toEqual({
        success: false,
        error: 'Not found',
        timestamp: '2025-03-10T12:00:00.000Z',
      });
      expect(status).toBe(404);
    });

    it('should handle different error messages', () => {
      const { response } = createErrorResponse('Validation failed');

      expect(response).toEqual({
        success: false,
        error: 'Validation failed',
        timestamp: '2025-03-10T12:00:00.000Z',
      });
    });
  });

  describe('HttpStatus', () => {
    it('should have the correct HTTP status codes', () => {
      expect(HttpStatus.OK).toBe(200);
      expect(HttpStatus.CREATED).toBe(201);
      expect(HttpStatus.BAD_REQUEST).toBe(400);
      expect(HttpStatus.UNAUTHORIZED).toBe(401);
      expect(HttpStatus.FORBIDDEN).toBe(403);
      expect(HttpStatus.NOT_FOUND).toBe(404);
      expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });
});
