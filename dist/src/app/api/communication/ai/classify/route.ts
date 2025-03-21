import { NextRequest, NextResponse } from 'next/server';
import { classifyMessage } from '@/services/openai';

export async function POST(request: NextRequest) {
  try {
    const { text, categories } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'Valid categories array is required' },
        { status: 400 }
      );
    }
    
    const result = await classifyMessage({ text, categories });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in message classification API:', error);
    return NextResponse.json(
      { error: 'Failed to classify message' },
      { status: 500 }
    );
  }
}
