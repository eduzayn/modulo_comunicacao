import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useTemplates } from '../../../hooks/use-templates';

// Mock the server actions
jest.mock('../../../app/actions/template-actions', () => ({
  fetchTemplates: jest.fn(),
  fetchTemplateById: jest.fn(),
  addTemplate: jest.fn(),
  editTemplate: jest.fn(),
  removeTemplate: jest.fn(),
}));

// Import the mocked module
import * as templateActions from '../../../app/actions/template-actions';

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTemplates hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch templates on mount', async () => {
    const mockTemplates = [
      { id: '1', name: 'Template 1', content: 'Content 1', status: 'active' },
      { id: '2', name: 'Template 2', content: 'Content 2', status: 'draft' },
    ];

    (templateActions.fetchTemplates as jest.Mock).mockResolvedValue({
      data: mockTemplates,
      error: null,
    });

    const wrapper = createWrapper();
    const { result, waitFor } = renderHook(() => useTemplates(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(templateActions.fetchTemplates).toHaveBeenCalledTimes(1);
    expect(result.current.templates).toEqual(mockTemplates);
    expect(result.current.error).toBeNull();
  });
});
