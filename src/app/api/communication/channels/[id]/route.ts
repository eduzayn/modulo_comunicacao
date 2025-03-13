import { NextResponse } from 'next/server';
// import { Channel } from '../../../../../services/supabase/channels';
import type { Channel } from '../../../../../types';
import type { UpdateChannelInput } from '../../../../../types/channels';
import { z } from 'zod';

const updateChannelSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  type: z.enum(['whatsapp', 'email', 'chat', 'sms', 'push']).optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  config: z.record(z.any()).optional()
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const channel = await getChannelById(params.id);
    return NextResponse.json(channel);
  } catch (error: unknown) {
    console.error('Error in channel GET route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch channel' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = updateChannelSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid channel data', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    const channel = await updateChannel(params.id, result.data);
    return NextResponse.json(channel);
  } catch (error: unknown) {
    console.error('Error in channel PUT route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update channel' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteChannel(params.id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error in channel DELETE route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete channel' },
      { status: 500 }
    );
  }
}
