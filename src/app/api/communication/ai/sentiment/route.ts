import { NextRequest, NextResponse } from 'next/server';
import { analyzeSentiment } from '@/services/openai';

export async function POST(// request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    const result = await analyzeSentiment({ text });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in sentiment analysis API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}
