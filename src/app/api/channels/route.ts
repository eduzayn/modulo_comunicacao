import { NextResponse } from 'next/server';
// // import { Channel } from '@/app/actions/channel-actions';
import type { Channel } from '@/types/index';
import type { CreateChannelInput } from '@/types/channels';

export async function GET() {
  try {
    const result = await fetchChannels();
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in channels GET route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: CreateChannelInput = await request.json();
    const result = await addChannel(data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error in channels POST route:', error);
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}
