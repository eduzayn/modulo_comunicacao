import { renderHook } from '@testing-library/react-hooks';
import { useTemplates } from '../../../hooks/use-templates';
import { fetchTemplates } from '../../../app/actions/template-actions';

// Mock the server actions
jest.mock('../../../app/actions/template-actions', () => ({
  fetchTemplates: jest.fn(),
  fetchTemplateById: jest.fn(),
  createTemplate: jest.fn(),
  updateTemplate: jest.fn(),
  deleteTemplate: jest.fn(),
}));

describe('useTemplates hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (fetchTemplates as jest.Mock).mockResolvedValue([
      {
        id: '1',
        name: 'Welcome Template',
        content: 'Welcome to our service!',
        type: 'email',
        variables: ['name', 'company'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }
    ]);
  });

  it('should fetch templates on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTemplates());
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.templates).toEqual([]);
    
    // Wait for the fetch to complete
    await waitForNextUpdate();
    
    // Should have called fetchTemplates
    expect(fetchTemplates).toHaveBeenCalledTimes(1);
  });
});
