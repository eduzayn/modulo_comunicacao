import { NextRequest } from 'next/server';
import { withApiResponse } from '../../../../lib/api-middleware';
import { withAuth } from '../../../../lib/auth/authenticate';
import { 
  fetchConversations,
  createConversation 
} from '../../../../services/supabase/conversations';

/**
 * GET /api/communication/conversations
 * Fetch all conversations
 */
export const GET = withApiResponse(
  withAuth(async (req: NextRequest, context, userId: string) => {
    const conversations = await fetchConversations();
    return conversations;
  })
);

/**
 * POST /api/communication/conversations
 * Create a new conversation
 */
export const POST = withApiResponse(
  withAuth(async (req: NextRequest, context, userId: string) => {
    const data = await req.json();
    
    // Validate required fields
    if (!data.channelId) {
      throw new Error('Channel ID is required');
    }
    
    // Create conversation
    const result = await createConversation({
      ...data,
      createdBy: userId,
    });
    
    return result;
  })
);
