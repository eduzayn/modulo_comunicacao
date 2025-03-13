import { BaseService } from '@/services/supabase/base-service';
import { supabase } from '@/lib/supabase';

// Mock supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
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
    filter: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  }
}));

// Test implementation of BaseService
class TestService extends BaseService<{ id: string; name: string; status: string }> {
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
  
  describe('getById', () => {
    it('should fetch a record by id', async () => {
      const mockData = { id: '1', name: 'Test Item', status: 'active' };
      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null
      });
      
      const result = await service.getById('1');
      
      expect(supabase.from).toHaveBeenCalledWith('test_table');
      expect(supabase.from().select).toHaveBeenCalledWith('*');
      expect(supabase.from().select().eq).toHaveBeenCalledWith('id', '1');
      expect(supabase.from().select().eq().single).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
    
    it('should throw an error when the record is not found', async () => {
      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Record not found' }
      });
      
      await expect(service.getById('999')).rejects.toThrow('Record not found');
    });
  });
  
  describe('getAll', () => {
    it('should fetch all records', async () => {
      const mockData = [
        { id: '1', name: 'Item 1', status: 'active' },
        { id: '2', name: 'Item 2', status: 'inactive' }
      ];
      (supabase.from().select().order as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null
      });
      
      const result = await service.getAll();
      
      expect(supabase.from).toHaveBeenCalledWith('test_table');
      expect(supabase.from().select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockData);
    });
    
    it('should throw an error when fetching fails', async () => {
      (supabase.from().select().order as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      });
      
      await expect(service.getAll()).rejects.toThrow('Database error');
    });
  });
  
  describe('create', () => {
    it('should create a new record', async () => {
      const newItem = { name: 'New Item', status: 'active' };
      const createdItem = { id: '3', ...newItem };
      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue({
        data: createdItem,
        error: null
      });
      
      const result = await service.create(newItem);
      
      expect(supabase.from).toHaveBeenCalledWith('test_table');
      expect(supabase.from().insert).toHaveBeenCalledWith(newItem);
      expect(supabase.from().insert().select).toHaveBeenCalledWith('*');
      expect(result).toEqual(createdItem);
    });
    
    it('should throw an error when creation fails', async () => {
      const newItem = { name: 'New Item', status: 'active' };
      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Validation error' }
      });
      
      await expect(service.create(newItem)).rejects.toThrow('Validation error');
    });
  });
  
  describe('update', () => {
    it('should update an existing record', async () => {
      const updateData = { name: 'Updated Item' };
      const updatedItem = { id: '1', name: 'Updated Item', status: 'active' };
      (supabase.from().update().eq().select().single as jest.Mock).mockResolvedValue({
        data: updatedItem,
        error: null
      });
      
      const result = await service.update('1', updateData);
      
      expect(supabase.from).toHaveBeenCalledWith('test_table');
      expect(supabase.from().update).toHaveBeenCalledWith(updateData);
      expect(supabase.from().update().eq).toHaveBeenCalledWith('id', '1');
      expect(result).toEqual(updatedItem);
    });
    
    it('should throw an error when update fails', async () => {
      const updateData = { name: 'Updated Item' };
      (supabase.from().update().eq().select().single as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Record not found' }
      });
      
      await expect(service.update('999', updateData)).rejects.toThrow('Record not found');
    });
  });
  
  describe('delete', () => {
    it('should delete a record', async () => {
      const deletedItem = { id: '1', name: 'Test Item', status: 'active' };
      (supabase.from().delete().eq().select().single as jest.Mock).mockResolvedValue({
        data: deletedItem,
        error: null
      });
      
      const result = await service.delete('1');
      
      expect(supabase.from).toHaveBeenCalledWith('test_table');
      expect(supabase.from().delete).toHaveBeenCalled();
      expect(supabase.from().delete().eq).toHaveBeenCalledWith('id', '1');
      expect(result).toEqual(deletedItem);
    });
    
    it('should throw an error when deletion fails', async () => {
      (supabase.from().delete().eq().select().single as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Record not found' }
      });
      
      await expect(service.delete('999')).rejects.toThrow('Record not found');
    });
  });
});
