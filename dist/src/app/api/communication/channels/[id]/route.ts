/**
 * route.ts
 * 
 * Description: API route for channel operations by ID
 * 
 * @module app/api/communication/channels/[id]
 * @author Devin AI
 * @created 2025-03-12
 */
import { NextRequest, NextResponse } from 'next/server';
import { getChannelById, updateChannel, deleteChannel } from '@/app/actions/channel-actions';
import { withLogging } from '@/lib/with-logging';
import { withMetrics } from '@/lib/with-metrics';

/**
 * GET handler for channel by ID
 * 
 * @param request - Next.js request object
 * @param params - Route parameters
 * @returns Channel response
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await getChannelById(id);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching channel:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channel' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for channel by ID
 * 
 * @param request - Next.js request object
 * @param params - Route parameters
 * @returns Updated channel response
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const result = await updateChannel(id, data);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating channel:', error);
    return NextResponse.json(
      { error: 'Failed to update channel' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for channel by ID
 * 
 * @param request - Next.js request object
 * @param params - Route parameters
 * @returns Delete response
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await deleteChannel(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting channel:', error);
    return NextResponse.json(
      { error: 'Failed to delete channel' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const GET_enhanced = withMetrics(withLogging(GET, 'GET /api/communication/channels/[id]'));
export const PUT_enhanced = withMetrics(withLogging(PUT, 'PUT /api/communication/channels/[id]'));
export const DELETE_enhanced = withMetrics(withLogging(DELETE, 'DELETE /api/communication/channels/[id]'));
