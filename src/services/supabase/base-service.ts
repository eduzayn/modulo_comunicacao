/**
 * Base service for Supabase operations
 * 
 * This provides common CRUD operations for Supabase tables
 */

import { supabase, supabaseAdmin } from '../../lib/supabase';
// import type { Database } from '../../lib/database.types';

// Use admin client for operations that need to bypass RLS
const adminClient = supabaseAdmin || supabase;

/**
 * Base service class for Supabase operations
 */
export class BaseService {
  protected tableName: string;
  
  constructor(tableName: string) {
    this.tableName = tableName;
  }
  
  /**
   * Get all items from the table
   */
  async getAll<T>(): Promise<T[]> {
    const { data, error } = await adminClient
      .from(this.tableName)
      .select('*');
    
    if (error) {
      throw new Error(`Failed to get items from ${this.tableName}: ${error.message}`);
    }
    
    return data as T[] || [];
  }
  
  /**
   * Get an item by ID
   */
  async getItemById<T>(id: string): Promise<T | null> {
    const { data, error } = await adminClient
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to get item from ${this.tableName}: ${error.message}`);
    }
    
    return data as T;
  }
  
  /**
   * Create a new item
   */
  async createItem<T>(item: Record<string, unknown>): Promise<T> {
    const { data, error } = await adminClient
      .from(this.tableName)
      .insert(item)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create item in ${this.tableName}: ${error.message}`);
    }
    
    return data as T;
  }
  
  /**
   * Update an item
   */
  async updateItem<T>(id: string, updates: Record<string, unknown>): Promise<T> {
    const { data, error } = await adminClient
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update item in ${this.tableName}: ${error.message}`);
    }
    
    return data as T;
  }
  
  /**
   * Delete an item
   */
  async deleteItem(id: string): Promise<void> {
    const { error } = await adminClient
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete item from ${this.tableName}: ${error.message}`);
    }
  }
}

// Export supabase client for direct use
export { supabase };
