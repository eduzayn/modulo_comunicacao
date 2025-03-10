import { NextResponse } from 'next/server';
import { getChannels, createChannel } from '../../../../services/supabase/channels';
import type { Channel } from '../../../../types';
import type { CreateChannelInput } from '../../../../types/channels';
import { z } from 'zod';

const createChannelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(['whatsapp', 'email', 'chat', 'sms', 'push']),
  status: z.enum(['active', 'inactive', 'maintenance']),
  config: z.record(z.any()).optional()
});

export async function GET() {
  try {
    const channels = await getChannels();
    return NextResponse.json(channels);
  } catch (error: any) {
    console.error('Error in channels GET route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = createChannelSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid channel data', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    // Convert Zod validated data to CreateChannelInput type
    const channelInput: CreateChannelInput = {
      name: result.data.name,
      type: result.data.type,
      // Status is optional in CreateChannelInput
      ...(result.data.status && { status: result.data.status }),
      // Convert config to appropriate type based on channel type
      config: result.data.config || {} as any
    };
    const channel = await createChannel(channelInput);
    return NextResponse.json(channel, { status: 201 });
  } catch (error: any) {
    console.error('Error in channels POST route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create channel' },
      { status: 500 }
    );
  }
}
