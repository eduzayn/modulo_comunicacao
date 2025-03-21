import { supabase } from '@/lib/supabase';
import { ChannelService } from '@/services/supabase/channels';
import { TemplateService } from '@/services/supabase/templates';
import { ConversationService } from '@/services/supabase/conversations';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
  },
}));

describe('Supabase Services', () => {
  let mockFrom;
  let mockSelect;
  let mockInsert;
  let mockUpdate;
  let mockDelete;
  let mockEq;
  let mockSingle;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup mock chain
    mockSingle = jest.fn();
    mockEq = jest.fn().mockReturnValue({ single: mockSingle });
    mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    mockInsert = jest.fn();
    mockUpdate = jest.fn();
    mockDelete = jest.fn();
    
    mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    });
    
    supabase.from = mockFrom;
  });
  
  describe('ChannelService', () => {
    let channelService;
    
    beforeEach(() => {
      channelService = new ChannelService();
    });
    
    it('should get all channels', async () => {
      const mockChannels = [
        { id: '1', name: 'WhatsApp Channel', type: 'whatsapp' },
        { id: '2', name: 'Email Channel', type: 'email' },
      ];
      
      mockSelect.mockReturnValue({
        data: mockChannels,
        error: null,
      });
      
      const result = await channelService.getChannels();
      
      expect(mockFrom).toHaveBeenCalledWith('communication.channels');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockChannels);
    });
    
    it('should get a channel by ID', async () => {
      const mockChannel = { id: '1', name: 'WhatsApp Channel', type: 'whatsapp' };
      
      mockSingle.mockReturnValue({
        data: mockChannel,
        error: null,
      });
      
      const result = await channelService.getChannelById('1');
      
      expect(mockFrom).toHaveBeenCalledWith('communication.channels');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', '1');
      expect(result).toEqual(mockChannel);
    });
    
    it('should create a new channel', async () => {
      const newChannel = { name: 'New Channel', type: 'sms' };
      const createdChannel = { id: '3', ...newChannel };
      
      mockInsert.mockReturnValue({
        select: jest.fn().mockReturnValue({
          data: [createdChannel],
          error: null,
        }),
      });
      
      const result = await channelService.createChannel(newChannel);
      
      expect(mockFrom).toHaveBeenCalledWith('communication.channels');
      expect(mockInsert).toHaveBeenCalledWith(newChannel);
      expect(result).toEqual(createdChannel);
    });
    
    it('should update a channel', async () => {
      const updates = { name: 'Updated Channel' };
      const updatedChannel = { id: '1', name: 'Updated Channel', type: 'whatsapp' };
      
      mockUpdate.mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            data: [updatedChannel],
            error: null,
          }),
        }),
      });
      
      const result = await channelService.updateChannel('1', updates);
      
      expect(mockFrom).toHaveBeenCalledWith('communication.channels');
      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(result).toEqual(updatedChannel);
    });
    
    it('should delete a channel', async () => {
      mockDelete.mockReturnValue({
        eq: jest.fn().mockReturnValue({
          data: null,
          error: null,
        }),
      });
      
      await channelService.deleteChannel('1');
      
      expect(mockFrom).toHaveBeenCalledWith('communication.channels');
      expect(mockDelete).toHaveBeenCalled();
    });
    
    it('should handle errors when getting channels', async () => {
      mockSelect.mockReturnValue({
        data: null,
        error: { message: 'Database error' },
      });
      
      await expect(channelService.getChannels()).rejects.toThrow('Database error');
    });
  });
  
  describe('TemplateService', () => {
    let templateService;
    
    beforeEach(() => {
      templateService = new TemplateService();
    });
    
    it('should get all templates', async () => {
      const mockTemplates = [
        { id: '1', name: 'Welcome Template', content: 'Welcome {{name}}!' },
        { id: '2', name: 'Support Template', content: 'How can we help you, {{name}}?' },
      ];
      
      mockSelect.mockReturnValue({
        data: mockTemplates,
        error: null,
      });
      
      const result = await templateService.getTemplates();
      
      expect(mockFrom).toHaveBeenCalledWith('communication.templates');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockTemplates);
    });
    
    it('should get templates with pagination', async () => {
      const mockTemplates = [
        { id: '1', name: 'Welcome Template', content: 'Welcome {{name}}!' },
      ];
      
      const mockRange = jest.fn().mockReturnValue({
        data: mockTemplates,
        error: null,
        count: 1,
      });
      
      const mockOrder = jest.fn().mockReturnValue({
        range: mockRange,
      });
      
      mockSelect.mockReturnValue({
        order: mockOrder,
      });
      
      const result = await templateService.getTemplatesWithPagination({ page: 1, pageSize: 10 });
      
      expect(mockFrom).toHaveBeenCalledWith('communication.templates');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalled();
      expect(mockRange).toHaveBeenCalled();
      expect(result.items).toEqual(mockTemplates);
      expect(result.pagination).toBeDefined();
    });
  });
  
  describe('ConversationService', () => {
    let conversationService;
    
    beforeEach(() => {
      conversationService = new ConversationService();
    });
    
    it('should get messages for a conversation', async () => {
      const mockMessages = [
        { id: 'm1', conversation_id: '1', content: 'Hello', sender_type: 'user' },
        { id: 'm2', conversation_id: '1', content: 'Hi there!', sender_type: 'agent' },
      ];
      
      const mockOrder = jest.fn().mockReturnValue({
        data: mockMessages,
        error: null,
      });
      
      const mockEq = jest.fn().mockReturnValue({
        order: mockOrder,
      });
      
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      
      const result = await conversationService.getMessages('1');
      
      expect(mockFrom).toHaveBeenCalledWith('communication.messages');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('conversation_id', '1');
      expect(result).toEqual(mockMessages);
    });
    
    it('should add a message to a conversation', async () => {
      const newMessage = {
        conversation_id: '1',
        content: 'New message',
        sender_type: 'user',
        sender_id: 'user-1',
      };
      
      const createdMessage = { id: 'm3', ...newMessage, created_at: '2025-03-10T12:00:00Z' };
      
      mockInsert.mockReturnValue({
        select: jest.fn().mockReturnValue({
          data: [createdMessage],
          error: null,
        }),
      });
      
      const result = await conversationService.addMessage(newMessage);
      
      expect(mockFrom).toHaveBeenCalledWith('communication.messages');
      expect(mockInsert).toHaveBeenCalledWith(newMessage);
      expect(result).toEqual(createdMessage);
    });
  });
});
