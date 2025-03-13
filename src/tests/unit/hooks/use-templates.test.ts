import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplates } from '@/hooks/use-templates';
import { fetchTemplates, fetchTemplateById } from '@/app/actions/template-actions';

// Mock the template actions
jest.mock('@/app/actions/template-actions', () => ({
  fetchTemplates: jest.fn(),
  fetchTemplateById: jest.fn(),
  createTemplate: jest.fn(),
  updateTemplate: jest.fn(),
  deleteTemplate: jest.fn(),
}));

describe('useTemplates hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch templates on mount', async () => {
    const mockTemplates = [
      { id: '1', name: 'Template 1', content: 'Content 1' },
      { id: '2', name: 'Template 2', content: 'Content 2' },
    ];

    (fetchTemplates as jest.Mock).mockResolvedValue({
      data: mockTemplates,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    expect(result.current.isLoading).toBe(true);
    expect(fetchTemplates).toHaveBeenCalledTimes(1);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.templates).toEqual(mockTemplates);
    expect(result.current.error).toBeNull();
  });

  it('should fetch a template by id', async () => {
    const mockTemplate = {
      id: '1',
      name: 'Template 1',
      content: 'Content 1',
    };

    (fetchTemplateById as jest.Mock).mockResolvedValue({
      data: mockTemplate,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    act(() => {
      result.current.getTemplateById('1');
    });

    expect(result.current.isLoading).toBe(true);
    expect(fetchTemplateById).toHaveBeenCalledWith('1');

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedTemplate).toEqual(mockTemplate);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch templates';
    
    (fetchTemplates as jest.Mock).mockResolvedValue({
      data: null,
      error: errorMessage,
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.templates).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });
});
