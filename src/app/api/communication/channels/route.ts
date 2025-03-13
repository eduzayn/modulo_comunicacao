import { NextRequest, NextResponse } from 'next/server';
import { fetchChannels, addChannel } from '@/app/actions/channel-actions';
import { z } from 'zod';
import type { Channel } from '@/types/index';
import type { CreateChannelInput, ChannelConfig } from '@/types/channels';
import { getAuthUser } from '@/lib/auth/get-auth-user';

/**
 * @swagger
 * /api/communication/channels:
 *   get:
 *     summary: Get all communication channels
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of communication channels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Channel'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new communication channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChannelInput'
 *     responses:
 *       201:
 *         description: Channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Channel'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

// Validation schema for channel creation
const createChannelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(['whatsapp', 'email', 'chat', 'sms', 'push']),
  status: z.enum(['active', 'inactive', 'maintenance']),
  config: z.record(z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.any())])).optional()
});

export async function GET(_request: NextRequest) {
  try {
    // Get user ID from request using auth utility
    const userId = await getAuthUser();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch channels for the user
    const result = await fetchChannels();
    
    return NextResponse.json({
      success: true,
      data: result.data || []
    });
  } catch (error) {
    console.error('Error in channels GET route:', error);
    const err = error as Error;
    return NextResponse.json(
      { 
        success: false, 
        error: err.message || 'Failed to fetch channels' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from request using auth utility
    const userId = await getAuthUser();
    
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
      config: validationResult.data.config || {} as ChannelConfig
    };
    
    const result = await addChannel(channelInput);
    
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
  } catch (error) {
    console.error('Error in channels POST route:', error);
    const err = error as Error;
    return NextResponse.json(
      { 
        success: false, 
        error: err.message || 'Failed to create channel' 
      },
      { status: 500 }
    );
  }
}
