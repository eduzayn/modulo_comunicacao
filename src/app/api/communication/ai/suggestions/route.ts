import { NextRequest, NextResponse } from 'next/server';
import { generateResponseSuggestions } from '@/services/openai';

export async function POST(request: NextRequest) {
  try {
    const { conversationHistory, maxSuggestions } = await request.json();
    
    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: 'Valid conversation history is required' },
        { status: 400 }
      );
    }
    
    const suggestions = await generateResponseSuggestions({ 
      conversationHistory,
      maxSuggestions: maxSuggestions || 3
    });
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error in response suggestions API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response suggestions' },
      { status: 500 }
    );
  }
}
