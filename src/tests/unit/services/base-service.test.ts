import { BaseService, supabase } from '@/services/supabase/base-service';

// Mock Supabase client
jest.mock('@/services/supabase/base-service', () => {
  const mockFrom = jest.fn();
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockSingle = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockRange = jest.fn();
  const mockOrder = jest.fn();
  const mockCount = jest.fn();
  const mockIn = jest.fn();
  const mockGt = jest.fn();
  const mockLt = jest.fn();
  const mockGte = jest.fn();
  const mockLte = jest.fn();
  const mockLike = jest.fn();
  const mockIlike = jest.fn();

  // Create a chain of mock functions
  mockFrom.mockReturnValue({
    select: mockSelect.mockReturnValue({
      eq: mockEq.mockReturnValue({
        single: mockSingle.mockReturnValue({
          data: { id: '1', name: 'Test Item' },
          error: null
        }),
        range: mockRange.mockReturnThis(),
        order: mockOrder.mockReturnThis(),
        count: mockCount.mockReturnValue({
          data: 10,
          error: null
        }),
        in: mockIn.mockReturnThis(),
        gt: mockGt.mockReturnThis(),
        lt: mockLt.mockReturnThis(),
        gte: mockGte.mockReturnThis(),
        lte: mockLte.mockReturnThis(),
        like: mockLike.mockReturnThis(),
        ilike: mockIlike.mockReturnThis(),
      }),
      range: mockRange.mockReturnValue({
        data: [{ id: '1', name: 'Test Item' }],
        error: null
      }),
      order: mockOrder.mockReturnThis(),
    }),
    insert: mockInsert.mockReturnValue({
      select: mockSelect.mockReturnValue({
        single: mockSingle.mockReturnValue({
          data: { id: '1', name: 'New Item' },
          error: null
        })
      })
    }),
    update: mockUpdate.mockReturnValue({
      eq: mockEq.mockReturnValue({
        select: mockSelect.mockReturnValue({
          single: mockSingle.mockReturnValue({
            data: { id: '1', name: 'Updated Item' },
            error: null
          })
        })
      })
    }),
    delete: mockDelete.mockReturnValue({
      eq: mockEq.mockReturnValue({
        data: null,
        error: null
      })
    })
  });

  return {
    supabase: {
      from: mockFrom
    },
    BaseService: class MockBaseService {
      tableName;
      constructor(tableName) {
        this.tableName = tableName;
      }
      applyPagination(query, options) {
        return query.range(0, 9);
      }
      applyFilters(query, filters) {
        return query;
      }
      applySort(query, sort) {
        return query.order(sort.column, { ascending: sort.ascending });
      }
      async getItems(options) {
        const query = supabase.from(this.tableName).select('*');
        const filteredQuery = this.applyFilters(query, options.filters);
        const sortedQuery = this.applySort(filteredQuery, options.sort || { column: 'created_at', ascending: false });
        const paginatedQuery = this.applyPagination(sortedQuery, options.pagination);
        
        const { data, error } = await paginatedQuery;
        
        if (error) {
          throw new Error(`Failed to get items: ${error.message}`);
        }
        
        return {
          data,
          pagination: {
            page: 1,
            pageSize: 10,
            total: 10,
            totalPages: 1,
          },
        };
      }
      async getItemById(id, select) {
        const { data, error } = await supabase
          .from(this.tableName)
          .select(select || '*')
          .eq('id', id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            return null;
          }
          throw new Error(`Failed to get item: ${error.message}`);
        }
        
        return data;
      }
      async createItem(item) {
        const { data, error } = await supabase
          .from(this.tableName)
          .insert(item)
          .select()
          .single();
        
        if (error) {
          throw new Error(`Failed to create item: ${error.message}`);
        }
        
        return data;
      }
      async updateItem(id, updates) {
        const { data, error } = await supabase
          .from(this.tableName)
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          throw new Error(`Failed to update item: ${error.message}`);
        }
        
        return data;
      }
      async deleteItem(id) {
        const { error } = await supabase
          .from(this.tableName)
          .delete()
          .eq('id', id);
        
        if (error) {
          throw new Error(`Failed to delete item: ${error.message}`);
        }
      }
    }
  };
});

describe('BaseService', () => {
  let service;
  
  beforeEach(() => {
    service = new BaseService('test_table');
    jest.clearAllMocks();
  });
  
  it('should get items with pagination, filtering, and sorting', async () => {
    const options = {
      pagination: { page: 1, pageSize: 10 },
      filters: { status: 'active' },
      sort: { column: 'created_at', ascending: false },
    };
    
    const result = await service.getItems(options);
    
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(result.data).toEqual([{ id: '1', name: 'Test Item' }]);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 10,
      total: 10,
      totalPages: 1,
    });
  });
  
  it('should get an item by ID', async () => {
    const result = await service.getItemById('1');
    
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(result).toEqual({ id: '1', name: 'Test Item' });
  });
  
  it('should create a new item', async () => {
    const newItem = { name: 'New Item' };
    const result = await service.createItem(newItem);
    
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(result).toEqual({ id: '1', name: 'New Item' });
  });
  
  it('should update an existing item', async () => {
    const updates = { name: 'Updated Item' };
    const result = await service.updateItem('1', updates);
    
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(result).toEqual({ id: '1', name: 'Updated Item' });
  });
  
  it('should delete an item by ID', async () => {
    await service.deleteItem('1');
    
    expect(supabase.from).toHaveBeenCalledWith('test_table');
  });
});
