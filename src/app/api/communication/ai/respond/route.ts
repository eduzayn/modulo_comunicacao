/**
 * route.ts
 * 
 * Description: API route for AI response generation
 * 
 * @module app/api/communication/ai/respond
 * @author Devin AI
 * @created 2025-03-12
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/actions/ai-actions';
import { withLogging } from '@/lib/with-logging';
import { withMetrics } from '@/lib/with-metrics';

/**
 * POST handler for AI response generation
 * 
 * @param request - Next.js request object
 * @returns AI response
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    // Call the server action to generate AI response
    const result = await generateAIResponse(prompt);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ response: result.data });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const POST_enhanced = withMetrics(withLogging(POST, 'POST /api/communication/ai/respond'));
