/**
 * Optimized Supabase service for conversations
 * 
 * This service provides optimized methods for working with conversations
 * in the Supabase database.
 */

import { BaseService, QueryOptions, QueryResult } from './base-service';
import { supabase } from './base-service';
import type { Conversation, Message } from '@/types';

/**
 * Conversation service with optimized query methods
 */
export class ConversationService extends BaseService {
  constructor() {
    super('conversations');
  }

  /**
   * Get conversations with pagination, filtering, and related data
   */
  async getConversations(options: QueryOptions = {}): Promise<QueryResult<Conversation>> {
    // Extend the select to include message count
    const select = options.select || '*, messages:messages(count)';
    
    return this.getItems<Conversation>({
      ...options,
      select,
    });
  }

  /**
   * Get a conversation by ID with its messages
   */
  async getConversationWithMessages(id: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        messages:messages(
          *,
          sender:profiles(id, name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get conversation: ${error.message}`);
    }
    
    return data as Conversation;
  }

  /**
   * Add a message to a conversation
   */
  async addMessage(conversationId: string, message: Partial<Message>): Promise<Message> {
    // First, check if the conversation exists
    const conversation = await this.getItemById(conversationId);
    
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }
    
    // Add the message
    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...message,
        conversation_id: conversationId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to add message: ${error.message}`);
    }
    
    // Update the conversation's updated_at timestamp
    await this.updateItem(conversationId, {
      updated_at: new Date().toISOString(),
    });
    
    return data as Message;
  }

  /**
   * Get messages for a conversation with pagination
   */
  async getMessages(
    conversationId: string,
    options: QueryOptions = {}
  ): Promise<QueryResult<Message>> {
    const { 
      pagination = { page: 1, pageSize: 20 },
      sort = { column: 'created_at', ascending: false },
      select = '*',
    } = options;
    
    const { page = 1, pageSize = 20 } = pagination;
    
    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId);
    
    if (countError) {
      throw new Error(`Failed to get message count: ${countError.message}`);
    }
    
    // Get paginated messages
    const { data, error } = await supabase
      .from('messages')
      .select(select)
      .eq('conversation_id', conversationId)
      .order(sort.column, { ascending: sort.ascending })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      throw new Error(`Failed to get messages: ${error.message}`);
    }
    
    return {
      data: data as Message[],
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: count ? Math.ceil(count / pageSize) : 0,
      },
    };
  }

  /**
   * Update conversation status
   */
  async updateStatus(id: string, status: string): Promise<Conversation> {
    return this.updateItem(id, { status });
  }

  /**
   * Get recent conversations for a user
   */
  async getRecentConversations(
    userId: string,
    limit: number = 5
  ): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        messages:messages(
          content,
          created_at,
          sender_id
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to get recent conversations: ${error.message}`);
    }
    
    return data as Conversation[];
  }
}

// Export a singleton instance
export const conversationService = new ConversationService();
