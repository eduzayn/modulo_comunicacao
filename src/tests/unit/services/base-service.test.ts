import { BaseService } from '../../../services/supabase/base-service';

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn(),
  match: jest.fn().mockReturnThis(),
  data: null,
  error: null,
};

// Test implementation of BaseService
class TestService extends BaseService {
  constructor() {
    super('test_table');
  }

  // Add any test-specific methods here
}

describe('BaseService', () => {
  let service: TestService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TestService();
    // Replace the supabase client with our mock
    (service as any).supabase = mockSupabaseClient;
  });

  it('should create a new record', async () => {
    const testData = { name: 'Test Item', status: 'active' };
    mockSupabaseClient.insert.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: [{ id: '1', ...testData }],
        error: null,
      }),
    });

    const result = await service.create(testData);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith(testData);
    expect(result).toEqual({ id: '1', ...testData });
  });

  it('should handle errors when creating a record', async () => {
    const testData = { name: 'Test Item', status: 'active' };
    const error = new Error('Database error');
    mockSupabaseClient.insert.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error,
      }),
    });

    await expect(service.create(testData)).rejects.toThrow('Database error');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith(testData);
  });

  it('should get a record by id', async () => {
    const testRecord = { id: '1', name: 'Test Item', status: 'active' };
    mockSupabaseClient.single.mockResolvedValue({
      data: testRecord,
      error: null,
    });

    const result = await service.getById('1');

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '1');
    expect(result).toEqual(testRecord);
  });

  it('should handle errors when getting a record by id', async () => {
    const error = new Error('Record not found');
    mockSupabaseClient.single.mockResolvedValue({
      data: null,
      error,
    });

    await expect(service.getById('1')).rejects.toThrow('Record not found');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '1');
  });

  it('should get all records', async () => {
    const testRecords = [
      { id: '1', name: 'Item 1', status: 'active' },
      { id: '2', name: 'Item 2', status: 'inactive' },
    ];
    mockSupabaseClient.select.mockResolvedValue({
      data: testRecords,
      error: null,
    });

    const result = await service.getAll();

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
    expect(result).toEqual(testRecords);
  });

  it('should update a record', async () => {
    const updateData = { name: 'Updated Item' };
    const updatedRecord = { id: '1', name: 'Updated Item', status: 'active' };
    mockSupabaseClient.update.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: [updatedRecord],
        error: null,
      }),
    });

    const result = await service.update('1', updateData);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
    expect(mockSupabaseClient.update).toHaveBeenCalledWith(updateData);
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '1');
    expect(result).toEqual(updatedRecord);
  });

  it('should delete a record', async () => {
    mockSupabaseClient.delete.mockResolvedValue({
      data: { id: '1' },
      error: null,
    });

    await service.delete('1');

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
    expect(mockSupabaseClient.delete).toHaveBeenCalled();
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '1');
  });
});
