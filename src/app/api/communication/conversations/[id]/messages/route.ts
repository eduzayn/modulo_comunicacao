import { NextRequest } from 'next/server';
import { withApiResponse } from '../../../../../../lib/api-middleware';
import { withAuth } from '../../../../../../lib/auth/authenticate';
import { 
  fetchConversationById, 
  sendMessage,
  getConversationMessages
} from '../../../../../../services/supabase/conversations';

/**
 * GET /api/communication/conversations/[id]/messages
 * Fetch messages for a conversation
 */
export const GET = withApiResponse(
  withAuth(async (req: NextRequest, context, userId: string) => {
    const conversationId = context.params.id as string;
    const messages = await getConversationMessages(conversationId);
    return messages;
  })
);

/**
 * POST /api/communication/conversations/[id]/messages
 * Send a message to a conversation
 */
export const POST = withApiResponse(
  withAuth(async (req: NextRequest, context, userId: string) => {
    const conversationId = context.params.id as string;
    const data = await req.json();
    
    // Validate required fields
    if (!data.content) {
      throw new Error('Message content is required');
    }
    
    // Send message
    const success = await sendMessage(conversationId, {
      ...data,
      senderId: userId,
    });
    
    if (!success) {
      throw new Error('Failed to send message');
    }
    
    // Return updated conversation
    const updatedConversation = await fetchConversationById(conversationId);
    return updatedConversation;
  })
);
