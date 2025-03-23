/**
 * base-service.ts
 * 
 * Description: Base service for Supabase operations
 * 
 * @module services/supabase/base-service
 * @author Devin AI
 * @created 2025-03-12
 */
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

// Export the supabase client for use in other services
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

/**
 * Base service class for Supabase operations
 */
export class BaseService {
  protected table: string;
  
  /**
   * Constructor
   * 
   * @param table - Table name
   */
  constructor(table: string) {
    this.table = table;
  }
  
  /**
   * Get all records
   * 
   * @param options - Query options
   * @returns All records
   */
  async getAll(options: { limit?: number; offset?: number; orderBy?: string; } = {}) {
    const { limit = 100, offset = 0, orderBy = 'created_at' } = options;
    
    let query = supabase
      .from(this.table)
      .select('*')
      .order(orderBy, { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching ${this.table}: ${error.message}`);
    }
    
    return data;
  }
  
  /**
   * Get a record by ID
   * 
   * @param id - Record ID
   * @returns Record data
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(`Error fetching ${this.table} with ID ${id}: ${error.message}`);
    }
    
    return data;
  }
  
  /**
   * Create a new record
   * 
   * @param data - Record data
   * @returns Created record
   */
  async create(data: Record<string, unknown>) {
    const { data: createdData, error } = await supabase
      .from(this.table)
      .insert(data)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error creating ${this.table}: ${error.message}`);
    }
    
    return createdData;
  }
  
  /**
   * Update a record
   * 
   * @param id - Record ID
   * @param data - Record data to update
   * @returns Updated record
   */
  async update(id: string, data: Record<string, unknown>) {
    const { data: updatedData, error } = await supabase
      .from(this.table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error updating ${this.table} with ID ${id}: ${error.message}`);
    }
    
    return updatedData;
  }
  
  /**
   * Delete a record
   * 
   * @param id - Record ID
   * @returns Void response
   */
  async delete(id: string) {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Error deleting ${this.table} with ID ${id}: ${error.message}`);
    }
    
    return true;
  }
  
  /**
   * Query records with filters
   * 
   * @param filters - Query filters
   * @param options - Query options
   * @returns Filtered records
   */
  async query(filters: Record<string, unknown>, options: { limit?: number; offset?: number; orderBy?: string; } = {}) {
    const { limit = 100, offset = 0, orderBy = 'created_at' } = options;
    
    let query = supabase
      .from(this.table)
      .select('*')
      .order(orderBy, { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error querying ${this.table}: ${error.message}`);
    }
    
    return data;
  }
}

export default BaseService;
