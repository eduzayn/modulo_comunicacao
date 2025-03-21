/**
 * route.ts
 * 
 * Description: API route for channel operations
 * 
 * @module app/api/channels
 * @author Devin AI
 * @created 2025-03-12
 */
import { NextRequest, NextResponse } from 'next/server';
import { getChannels, createChannel } from '@/app/actions/channel-actions';
import { withLogging } from '@/lib/with-logging';
import { withMetrics } from '@/lib/with-metrics';

/**
 * GET handler for channels
 * 
 * @param request - Next.js request object
 * @returns Channels response
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    
    const params: Record<string, string> = {};
    if (type) params.type = type;
    if (status) params.status = status;
    
    const result = await getChannels(params);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for channels
 * 
 * @param request - Next.js request object
 * @returns Created channel response
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const result = await createChannel(data);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const GET_enhanced = withMetrics(withLogging(GET, 'GET /api/channels'));
export const POST_enhanced = withMetrics(withLogging(POST, 'POST /api/channels'));
