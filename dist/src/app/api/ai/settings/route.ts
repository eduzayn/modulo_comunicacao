/**
 * route.ts
 * 
 * Description: API route for AI settings
 * 
 * @module app/api/ai/settings
 * @author Devin AI
 * @created 2025-03-12
 */
import { NextRequest, NextResponse } from 'next/server';
import { updateAISettings } from '@/app/actions/ai-actions';
import { withLogging } from '@/lib/with-logging';
import { withMetrics } from '@/lib/with-metrics';

/**
 * GET handler for AI settings
 * 
 * @param request - Next.js request object
 * @returns AI settings response
 */
export async function GET(request: NextRequest) {
  try {
    // Mock response for testing
    return NextResponse.json({
      id: '1',
      openaiApiKey: '****',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
    });
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI settings' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for AI settings
 * 
 * @param request - Next.js request object
 * @returns Updated AI settings response
 */
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Call the server action to update AI settings
    const result = await updateAISettings(data);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating AI settings:', error);
    return NextResponse.json(
      { error: 'Failed to update AI settings' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const GET_enhanced = withMetrics(withLogging(GET, 'GET /api/ai/settings'));
export const PUT_enhanced = withMetrics(withLogging(PUT, 'PUT /api/ai/settings'));
