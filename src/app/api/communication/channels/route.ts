import { NextRequest, NextResponse } from 'next/server';
import { getChannels, createChannel } from '@/app/actions/channel-actions';
import { z } from 'zod';
import type { Channel } from '@/types/channels';
import type { CreateChannelInput } from '@/types/channels';
import { getAuthUser } from '@/lib/auth/get-auth-user';

// Validation schema for channel creation
const createChannelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(['whatsapp', 'email', 'chat', 'sms', 'push']),
  status: z.enum(['active', 'inactive', 'maintenance']),
  config: z.record(z.any()).optional()
});

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request using auth utility
    const userId = await getAuthUser(request);
    
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
    // Get user ID from request using auth utility
    const userId = await getAuthUser(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    const validationResult = createChannelSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid channel data', 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    // Convert Zod validated data to CreateChannelInput type
    const channelInput: CreateChannelInput = {
      name: validationResult.data.name,
      type: validationResult.data.type,
      // Status is optional in CreateChannelInput
      ...(validationResult.data.status && { status: validationResult.data.status }),
      // Convert config to appropriate type based on channel type
      config: validationResult.data.config || {} as any
    };
    
    const result = await createChannel(channelInput);
    
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
