import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplates, useTemplate } from '@/hooks/use-templates';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/query-client';
import { Template } from '@/types/templates';

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  authenticatedJsonFetch: jest.fn(),
}));

// Mock the auth hook
jest.mock('@/hooks/use-dev-auth', () => ({
  useDevAuth: () => ({
    getAuthHeaders: () => ({ 'x-api-key': 'test-key' }),
    isAuthenticated: true,
  }),
}));

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Welcome Email',
    type: 'email',
    content: 'Welcome to our platform, {{name}}!',
    variables: ['name'],
    status: 'active',
    created_at: '2025-03-10T12:00:00Z',
    updated_at: '2025-03-10T12:00:00Z',
  },
  {
    id: '2',
    name: 'Order Confirmation',
    type: 'whatsapp',
    content: 'Your order #{{order_id}} has been confirmed.',
    variables: ['order_id'],
    status: 'active',
    created_at: '2025-03-10T11:00:00Z',
    updated_at: '2025-03-10T11:00:00Z',
  },
];

describe('useTemplates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch templates successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: mockTemplates,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 2,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useTemplates(), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.templates).toEqual([]);
    
    // Wait for the query to resolve
    await waitForNextUpdate();
    
    // After loading, we should have templates
    expect(result.current.isLoading).toBe(false);
    expect(result.current.templates).toEqual(mockTemplates);
    expect(result.current.pagination).toBeDefined();
    expect(result.current.pagination.total).toBe(2);
    expect(result.current.isError).toBe(false);
    
    // Verify API was called correctly
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/templates?page=1&pageSize=20',
      {},
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should handle error when fetching templates', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockRejectedValueOnce(new Error('Failed to fetch templates'));
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useTemplates(), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to resolve (with error)
    await waitForNextUpdate();
    
    // After error, we should have error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
    expect(result.current.templates).toEqual([]);
  });
  
  it('should create a new template successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the initial fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: mockTemplates,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 2,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the mutation
    const newTemplate: Partial<Template> = {
      name: 'New Template',
      type: 'sms',
      content: 'Your verification code is {{code}}',
      variables: ['code'],
      status: 'draft',
    };
    
    const createdTemplate: Template = {
      ...newTemplate,
      id: '3',
      created_at: '2025-03-10T13:00:00Z',
      updated_at: '2025-03-10T13:00:00Z',
    } as Template;
    
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: createdTemplate,
      timestamp: '2025-03-10T13:00:00Z'
    });
    
    // Mock the refetch after mutation
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: [...mockTemplates, createdTemplate],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 3,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T13:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useTemplates(), { wrapper });
    
    // Wait for initial fetch
    await waitForNextUpdate();
    
    // Create a new template
    act(() => {
      result.current.createTemplate(newTemplate);
    });
    
    // Wait for mutation to complete
    await waitForNextUpdate();
    
    // Verify API was called correctly for mutation
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/templates',
      {
        method: 'POST',
        body: JSON.stringify(newTemplate)
      },
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should filter templates by type', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the initial fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: mockTemplates,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 2,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the filtered fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: [mockTemplates[0]], // Only email templates
        pagination: {
          page: 1,
          pageSize: 20,
          total: 1,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T12:01:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useTemplates(), { wrapper });
    
    // Wait for initial fetch
    await waitForNextUpdate();
    
    // Filter templates by type
    act(() => {
      result.current.filterByType('email');
    });
    
    // Wait for filtered fetch
    await waitForNextUpdate();
    
    // Verify API was called correctly for filtering
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/templates?page=1&pageSize=20&type=email',
      {},
      { 'x-api-key': 'test-key' }
    );
    
    // Verify filtered results
    expect(result.current.templates).toHaveLength(1);
    expect(result.current.templates[0].type).toBe('email');
  });
});

describe('useTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a single template by ID', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockTemplates[0],
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useTemplate('1'), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.template).toBeUndefined();
    
    // Wait for the query to resolve
    await waitForNextUpdate();
    
    // After loading, we should have the template
    expect(result.current.isLoading).toBe(false);
    expect(result.current.template).toEqual(mockTemplates[0]);
    expect(result.current.isError).toBe(false);
    
    // Verify API was called correctly
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/templates/1',
      {},
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should handle error when fetching a single template', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockRejectedValueOnce(new Error('Template not found'));
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useTemplate('999'), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to resolve (with error)
    await waitForNextUpdate();
    
    // After error, we should have error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
    expect(result.current.template).toBeUndefined();
  });
  
  it('should update a template successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the initial fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockTemplates[0],
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the update mutation
    const updatedTemplate = {
      ...mockTemplates[0],
      name: 'Updated Template Name',
      content: 'Updated content with {{name}}',
      updated_at: '2025-03-10T14:00:00Z'
    };
    
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: updatedTemplate,
      timestamp: '2025-03-10T14:00:00Z'
    });
    
    // Mock the refetch after mutation
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: updatedTemplate,
      timestamp: '2025-03-10T14:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useTemplate('1'), { wrapper });
    
    // Wait for initial fetch
    await waitForNextUpdate();
    
    // Update the template
    act(() => {
      result.current.updateTemplate({
        name: 'Updated Template Name',
        content: 'Updated content with {{name}}'
      });
    });
    
    // Wait for mutation to complete
    await waitForNextUpdate();
    
    // Verify API was called correctly for mutation
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/templates/1',
      {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Template Name',
          content: 'Updated content with {{name}}'
        })
      },
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should delete a template successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the initial fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockTemplates[0],
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the delete mutation
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: { id: '1' },
      timestamp: '2025-03-10T14:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useTemplate('1'), { wrapper });
    
    // Wait for initial fetch
    await waitForNextUpdate();
    
    // Delete the template
    act(() => {
      result.current.deleteTemplate();
    });
    
    // Wait for mutation to complete
    await waitForNextUpdate();
    
    // Verify API was called correctly for deletion
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/templates/1',
      {
        method: 'DELETE'
      },
      { 'x-api-key': 'test-key' }
    );
  });
});
