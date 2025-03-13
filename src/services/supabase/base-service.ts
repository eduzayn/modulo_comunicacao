/**
 * base-service.ts
 * 
 * Description: This module provides a base service class for Supabase database operations.
 * It implements common CRUD operations with type safety and error handling.
 * 
 * @module services/supabase
 * @author Devin AI
 * @created 2025-03-13
 */

import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * BaseService - Abstract base class for Supabase table operations
 * 
 * This generic class provides type-safe CRUD operations for Supabase tables.
 * It handles error responses and provides consistent error handling.
 * 
 * @template T - The data type for the table records
 */
export abstract class BaseService<T extends { id: string }> {
  protected tableName: string;

  /**
   * Creates a new BaseService instance
   * 
   * @param tableName - The name of the Supabase table
   */
  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Retrieves a record by its ID
   * 
   * @param id - The unique identifier of the record
   * @returns Promise resolving to the record
   * @throws Error if the record is not found or another error occurs
   */
  async getById(id: string): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as T;
  }

  /**
   * Retrieves all records from the table
   * 
   * @param options - Optional query parameters
   * @returns Promise resolving to an array of records
   * @throws Error if the query fails
   */
  async getAll(options?: { 
    orderBy?: string; 
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    filters?: Record<string, unknown>;
  }): Promise<T[]> {
    let query = supabase
      .from(this.tableName)
      .select('*');

    // Apply filters if provided
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Apply ordering if provided
    if (options?.orderBy) {
      query = query.order(
        options.orderBy, 
        { ascending: options.orderDirection !== 'desc' }
      );
    }

    // Apply limit if provided
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data as T[];
  }

  /**
   * Creates a new record
   * 
   * @param data - The data for the new record
   * @returns Promise resolving to the created record
   * @throws Error if the creation fails
   */
  async create(data: Omit<T, 'id'>): Promise<T> {
    const { data: createdData, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return createdData as T;
  }

  /**
   * Updates an existing record
   * 
   * @param id - The unique identifier of the record to update
   * @param data - The data to update
   * @returns Promise resolving to the updated record
   * @throws Error if the update fails
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: updatedData, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return updatedData as T;
  }

  /**
   * Deletes a record
   * 
   * @param id - The unique identifier of the record to delete
   * @returns Promise resolving to the deleted record
   * @throws Error if the deletion fails
   */
  async delete(id: string): Promise<T> {
    const { data: deletedData, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return deletedData as T;
  }

  /**
   * Handles Supabase errors consistently
   * 
   * @param error - The PostgrestError to handle
   * @throws Error with a formatted message
   */
  protected handleError(error: PostgrestError): never {
    throw new Error(`Database error: ${error.message}`);
  }
}
