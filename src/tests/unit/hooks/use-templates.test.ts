import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplates } from '@/hooks/use-templates';
import { renderHookWithClient } from '@/tests/mocks/hooks';

// Mock the server actions
jest.mock('@/app/actions/template-actions', () => ({
  fetchTemplates: jest.fn(),
  fetchTemplateById: jest.fn(),
  addTemplate: jest.fn(),
  editTemplate: jest.fn(),
  removeTemplate: jest.fn(),
}));

// Import the mocked module
import * as templateActions from '@/app/actions/template-actions';

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

    const { result, waitForNextUpdate } = renderHookWithClient(() => useTemplates());

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

    const { result, waitForNextUpdate } = renderHookWithClient(() => useTemplates());

    await waitForNextUpdate(); // Wait for initial fetch

    act(() => {
      result.current.createTemplate(newTemplate);
    });

    expect(result.current.isCreating).toBe(true);
    expect(templateActions.addTemplate).toHaveBeenCalledWith(newTemplate);
  });
});
