import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useTemplates } from '../../../hooks/use-templates';

// Mock the server actions
jest.mock('../../../app/actions/templates-actions', () => ({
  fetchTemplates: jest.fn(),
  fetchTemplatesById: jest.fn(),
  addTemplates: jest.fn(),
  editTemplates: jest.fn(),
  removeTemplates: jest.fn(),
}));

// Import the mocked module
import * as templatesActions from '../../../app/actions/templates-actions';

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Add display name to fix ESLint error
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useTemplates hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch templates on mount', async () => {
    const mockTemplates = [
      { id: '1', name: 'Templates 1', status: 'active' },
      { id: '2', name: 'Templates 2', status: 'inactive' },
    ];

    templatesActions.fetchTemplates.mockResolvedValue({
      data: mockTemplates,
      error: null,
    });

    const wrapper = createWrapper();
    const { result, waitFor } = renderHook(() => useTemplates(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(templatesActions.fetchTemplates).toHaveBeenCalledTimes(1);
    expect(result.current.templates).toEqual(mockTemplates);
    expect(result.current.error).toBeNull();
  });
});
