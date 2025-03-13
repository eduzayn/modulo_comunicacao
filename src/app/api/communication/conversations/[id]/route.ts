import { NextRequest } from 'next/server';
import { withApiResponse } from '../../../../../lib/api-middleware';
import { withAuth } from '../../../../../lib/auth/authenticate';
import { 
  fetchConversationById, 
  updateConversation, 
  sendMessage 
} from '../../../../../services/supabase/conversations';

/**
 * GET /api/communication/conversations/[id]
 * Fetch a conversation by ID
 */
export const GET = withApiResponse(
  withAuth(async (req: NextRequest, context, userId: string) => {
    const id = context.params.id as string;
    const conversation = await fetchConversationById(id);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    return conversation;
  })
);

/**
 * PUT /api/communication/conversations/[id]
 * Update a conversation
 */
export const PUT = withApiResponse(
  withAuth(async (req: NextRequest, context, userId: string) => {
    const id = context.params.id as string;
    const data = await req.json();
    
    const result = await updateConversation(id, {
      ...data,
      updatedBy: userId,
    });
    
    if (!result) {
      throw new Error('Failed to update conversation');
    }
    
    return result;
  })
);
