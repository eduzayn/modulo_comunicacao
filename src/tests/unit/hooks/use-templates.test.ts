import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplates } from '@/hooks/use-templates';
import * as templateActions from '@/app/actions/template-actions';

// Mock the template actions
jest.mock('@/app/actions/template-actions', () => ({
  fetchTemplates: jest.fn(),
  fetchTemplateById: jest.fn(),
  addTemplate: jest.fn(),
  editTemplate: jest.fn(),
  removeTemplate: jest.fn(),
}));

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

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    expect(result.current.isLoading).toBe(true);
    expect(templateActions.fetchTemplates).toHaveBeenCalledTimes(1);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.templates).toEqual(mockTemplates);
    expect(result.current.error).toBeNull();
  });

  it('should create a new template', async () => {
    const newTemplate = {
      name: 'New Template',
      content: 'New Content',
      status: 'draft',
    };

    const createdTemplate = {
      id: '3',
      ...newTemplate,
      createdAt: new Date().toISOString(),
    };

    (templateActions.addTemplate as jest.Mock).mockResolvedValue({
      data: createdTemplate,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    act(() => {
      result.current.createTemplate(newTemplate);
    });

    expect(result.current.isCreating).toBe(true);
    expect(templateActions.addTemplate).toHaveBeenCalledWith(newTemplate);

    await waitForNextUpdate();

    expect(result.current.isCreating).toBe(false);
  });

  it('should delete a template', async () => {
    const templateId = '1';

    (templateActions.removeTemplate as jest.Mock).mockResolvedValue({
      success: true,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    act(() => {
      result.current.deleteTemplate(templateId);
    });

    expect(result.current.isDeleting).toBe(true);
    expect(templateActions.removeTemplate).toHaveBeenCalledWith(templateId);

    await waitForNextUpdate();

    expect(result.current.isDeleting).toBe(false);
  });
});
