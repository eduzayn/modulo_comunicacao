import { NextResponse } from 'next/server';
import { getConversationMessages, sendMessage } from '../../../../../../services/supabase/conversations';
import { z } from 'zod';

interface Params {
  params: {
    id: string;
  };
}

const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  sender_id: z.string(),
  media_url: z.string().url().optional()
});

export async function GET(request: Request, { params }: Params) {
  try {
    const messages = await getConversationMessages(params.id);
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = sendMessageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid message data', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    const message = await sendMessage(params.id, result.data);
    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send message' }, 
      { status: 500 }
    );
  }
}
