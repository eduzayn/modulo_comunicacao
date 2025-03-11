import { NextResponse } from 'next/server';
import { 
  getConversationById, 
  updateConversation, 
  getConversationMessages 
} from '../../../../../services/supabase/conversations';
import { z } from 'zod';

interface Params {
  params: {
    id: string;
  };
}

const updateConversationSchema = z.object({
  status: z.enum(['open', 'closed', 'archived']).optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  context: z.enum(['academic', 'administrative', 'support']).optional()
});

export async function GET(request: Request, { params }: Params) {
  try {
    const conversation = await getConversationById(params.id);
    return NextResponse.json(conversation);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversation' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = updateConversationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid conversation data', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    const conversation = await updateConversation(params.id, result.data);
    return NextResponse.json(conversation);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update conversation' }, 
      { status: 500 }
    );
  }
}
