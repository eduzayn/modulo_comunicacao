import { NextRequest, NextResponse } from 'next/server';
import { generateAutomatedResponse } from '@/services/openai';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Generate automated response
    const responseContent = await generateAutomatedResponse(message);
    
    // If a conversation ID is provided, save the response to the database
    if (conversationId) {
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (conversationError) {
        console.error('Error fetching conversation:', conversationError);
        return NextResponse.json(
          { error: 'Failed to fetch conversation' },
          { status: 500 }
        );
      }
      
      // Save the AI response as a message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: 'ai-assistant',
          content: responseContent,
          type: 'text',
          status: 'sent',
          metadata: { automated: true }
        });
      
      if (messageError) {
        console.error('Error saving AI response:', messageError);
        return NextResponse.json(
          { error: 'Failed to save AI response' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({ response: responseContent });
  } catch (error) {
    console.error('Error in automated response API:', error);
    return NextResponse.json(
      { error: 'Failed to generate automated response' },
      { status: 500 }
    );
  }
}
