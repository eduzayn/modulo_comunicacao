import { createClient } from '@supabase/supabase-js';
import { logger } from '../../lib/logger';
import { BaseService } from './base-service';
import type { 
  Conversation, 
  ConversationWithMessages, 
  CreateConversationInput, 
  UpdateConversationInput,
  SendMessageInput,
  Message
} from '../../types/conversations';

/**
 * Service for managing conversations
 */
class ConversationsService extends BaseService<Conversation> {
  constructor() {
    super('conversations');
  }

  /**
   * Fetch all conversations
   */
  async fetchConversations(): Promise<ConversationWithMessages[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*, messages(*)');

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error(`Failed to fetch conversations: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Fetch a conversation by ID
   */
  async fetchConversationById(id: string): Promise<ConversationWithMessages | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*, messages(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Failed to fetch conversation by ID: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationInput): Promise<Conversation | null> {
    try {
      const { data: newConversation, error } = await this.supabase
        .from(this.tableName)
        .insert({
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return newConversation;
    } catch (error) {
      logger.error(`Failed to create conversation: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Update an existing conversation
   */
  async updateConversation(id: string, data: UpdateConversationInput): Promise<Conversation | null> {
    try {
      const { data: updatedConversation, error } = await this.supabase
        .from(this.tableName)
        .update({
          ...data,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedConversation;
    } catch (error) {
      logger.error(`Failed to update conversation: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Send a message to a conversation
   */
  async sendMessage(conversationId: string, data: SendMessageInput): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('messages')
        .insert({
          conversationId,
          ...data,
          createdAt: new Date().toISOString()
        });

      if (error) throw error;
      
      // Update conversation's updatedAt timestamp
      await this.updateConversation(conversationId, {
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      logger.error(`Failed to send message: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Get messages for a conversation
   */
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .select('*')
        .eq('conversationId', conversationId)
        .order('createdAt', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error(`Failed to get conversation messages: ${(error as Error).message}`);
      return [];
    }
  }
}

// Create singleton instance
const conversationsService = new ConversationsService();

// Export individual methods for easier imports
export const fetchConversations = () => conversationsService.fetchConversations();
export const fetchConversationById = (id: string) => conversationsService.fetchConversationById(id);
export const createConversation = (data: CreateConversationInput) => conversationsService.createConversation(data);
export const updateConversation = (id: string, data: UpdateConversationInput) => conversationsService.updateConversation(id, data);
export const sendMessage = (conversationId: string, data: SendMessageInput) => conversationsService.sendMessage(conversationId, data);
export const getConversationMessages = (conversationId: string) => conversationsService.getConversationMessages(conversationId);

// Export the service instance for advanced usage
export default conversationsService;
