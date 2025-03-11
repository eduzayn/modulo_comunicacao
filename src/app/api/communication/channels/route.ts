import { NextRequest, NextResponse } from 'next/server';
import { getChannels, createChannel } from '@/app/actions/channel-actions';
import type { Channel } from '@/types/channels';
import type { CreateChannelInput } from '@/types/channels';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch channels for the user
    const channels = await getChannels();
    
    return NextResponse.json({
      success: true,
      data: channels
    });
  } catch (error: any) {
    console.error('Error in channels GET route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch channels' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from request headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const data: CreateChannelInput = await request.json();
    const result = await createChannel(data);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result.data
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error in channels POST route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create channel' 
      },
      { status: 500 }
    );
  }
}
