import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplates } from '@/hooks/use-templates';
import * as templateActions from '@/app/actions/template-actions';

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
      { id: '1', name: 'Template 1', content: 'Hello {{name}}', category: 'greeting' },
      { id: '2', name: 'Template 2', content: 'Goodbye {{name}}', category: 'farewell' },
    ];

    (templateActions.fetchTemplates as jest.Mock).mockResolvedValue({
      data: mockTemplates,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    expect(result.current.isLoading).toBe(true);
    expect(templateActions.fetchTemplates).toHaveBeenCalledTimes(1);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.templates).toEqual(mockTemplates);
    expect(result.current.error).toBeNull();
  });

  it('should fetch a template by id', async () => {
    const mockTemplate = {
      id: '1',
      name: 'Template 1',
      content: 'Hello {{name}}',
      category: 'greeting',
    };

    (templateActions.fetchTemplateById as jest.Mock).mockResolvedValue({
      data: mockTemplate,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    act(() => {
      result.current.getTemplateById('1');
    });

    expect(result.current.isLoading).toBe(true);
    expect(templateActions.fetchTemplateById).toHaveBeenCalledWith('1');

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedTemplate).toEqual(mockTemplate);
    expect(result.current.error).toBeNull();
  });

  // Add more tests for create, update, and delete operations
});
