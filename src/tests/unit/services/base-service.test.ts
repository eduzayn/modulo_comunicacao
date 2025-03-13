import { BaseService } from '../../services/supabase/base-service';

// Mock the Supabase client
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();
const mockOrder = jest.fn();
const mockFrom = jest.fn().mockReturnValue({
  select: mockSelect.mockReturnValue({
    eq: mockEq.mockReturnValue({
      single: mockSingle,
    }),
    order: mockOrder,
  }),
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete.mockReturnValue({
    eq: mockEq,
  }),
});

// Mock the supabase module
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

// Define a test model
interface TestModel {
  id: string;
  name: string;
  status: string;
}

// Create a test service class
class TestService extends BaseService<TestModel> {
  constructor() {
    super('test_table');
  }
}

describe('BaseService', () => {
  let service: TestService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TestService();
  });

  it('should create an instance with the correct table name', () => {
    expect(service['tableName']).toBe('test_table');
  });

  it('should get all records', async () => {
    const mockData = [
      { id: '1', name: 'Test 1', status: 'active' },
      { id: '2', name: 'Test 2', status: 'inactive' },
    ];

    mockSelect.mockReturnValueOnce({
      order: mockOrder.mockReturnValueOnce({
        data: mockData,
        error: null,
      }),
    });

    const result = await service.getAll();

    expect(mockFrom).toHaveBeenCalledWith('test_table');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(result).toEqual(mockData);
  });

  it('should get a record by ID', async () => {
    const mockData = { id: '1', name: 'Test 1', status: 'active' };

    mockSelect.mockReturnValueOnce({
      eq: mockEq.mockReturnValueOnce({
        single: mockSingle.mockResolvedValueOnce({
          data: mockData,
          error: null,
        }),
      }),
    });

    const result = await service.getById('1');

    expect(mockFrom).toHaveBeenCalledWith('test_table');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('id', '1');
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('should create a new record', async () => {
    const newData = { name: 'New Test', status: 'active' };
    const createdData = { id: '3', ...newData };

    mockInsert.mockReturnValueOnce({
      select: mockSelect.mockReturnValueOnce({
        single: mockSingle.mockResolvedValueOnce({
          data: createdData,
          error: null,
        }),
      }),
    });

    const result = await service.create(newData);

    expect(mockFrom).toHaveBeenCalledWith('test_table');
    expect(mockInsert).toHaveBeenCalledWith(newData);
    expect(mockSelect).toHaveBeenCalledWith();
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual(createdData);
  });

  it('should update a record', async () => {
    const updateData = { name: 'Updated Test' };
    const updatedData = { id: '1', name: 'Updated Test', status: 'active' };

    mockUpdate.mockReturnValueOnce({
      eq: mockEq.mockReturnValueOnce({
        select: mockSelect.mockReturnValueOnce({
          single: mockSingle.mockResolvedValueOnce({
            data: updatedData,
            error: null,
          }),
        }),
      }),
    });

    const result = await service.update('1', updateData);

    expect(mockFrom).toHaveBeenCalledWith('test_table');
    expect(mockUpdate).toHaveBeenCalledWith(updateData);
    expect(mockEq).toHaveBeenCalledWith('id', '1');
    expect(mockSelect).toHaveBeenCalledWith();
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual(updatedData);
  });

  it('should delete a record', async () => {
    mockDelete.mockReturnValueOnce({
      eq: mockEq.mockReturnValueOnce({
        then: jest.fn().mockResolvedValueOnce({
          error: null,
        }),
      }),
    });

    await service.delete('1');

    expect(mockFrom).toHaveBeenCalledWith('test_table');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', '1');
  });

  it('should handle errors when getting all records', async () => {
    mockSelect.mockReturnValueOnce({
      order: mockOrder.mockReturnValueOnce({
        data: null,
        error: new Error('Database error'),
      }),
    });

    await expect(service.getAll()).rejects.toThrow('Database error');
  });

  it('should handle errors when getting a record by ID', async () => {
    mockSelect.mockReturnValueOnce({
      eq: mockEq.mockReturnValueOnce({
        single: mockSingle.mockResolvedValueOnce({
          data: null,
          error: new Error('Record not found'),
        }),
      }),
    });

    await expect(service.getById('1')).rejects.toThrow('Record not found');
  });
});
