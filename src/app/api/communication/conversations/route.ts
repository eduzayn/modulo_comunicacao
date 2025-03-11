import { NextResponse } from 'next/server';
import { getConversations, createConversation } from '../../../../services/supabase/conversations';
import { z } from 'zod';

/**
 * @swagger
 * /api/communication/conversations:
 *   get:
 *     summary: Get all conversations
 *     tags: [Conversations]
 *     parameters:
 *       - in: query
 *         name: channelId
 *         schema:
 *           type: string
 *         description: Filter by channel ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed, archived]
 *         description: Filter by conversation status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [high, medium, low]
 *         description: Filter by priority level
 *       - in: query
 *         name: context
 *         schema:
 *           type: string
 *           enum: [academic, administrative, support]
 *         description: Filter by conversation context
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelId:
 *                 type: string
 *                 format: uuid
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [open, closed, archived]
 *                 default: open
 *               priority:
 *                 type: string
 *                 enum: [high, medium, low]
 *                 default: medium
 *               context:
 *                 type: string
 *                 enum: [academic, administrative, support]
 *                 default: support
 *             required:
 *               - participants
 *     responses:
 *       200:
 *         description: Conversation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

const createConversationSchema = z.object({
  channelId: z.string().uuid().optional(),
  participants: z.array(z.string()),
  status: z.enum(['open', 'closed', 'archived']).default('open'),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  context: z.enum(['academic', 'administrative', 'support']).default('support')
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params = {
      channelId: searchParams.get('channelId') || undefined,
      status: searchParams.get('status') as any || undefined,
      priority: searchParams.get('priority') as any || undefined,
      context: searchParams.get('context') as any || undefined
    };
    
    const conversations = await getConversations(params);
    return NextResponse.json(conversations);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = createConversationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid conversation data', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    // Create conversation using the validated data directly
    // The createConversation function already handles the field name conversion
    const conversation = await createConversation({
      channelId: result.data.channelId,
      participants: result.data.participants,
      status: result.data.status,
      priority: result.data.priority,
      context: result.data.context
    });
    return NextResponse.json(conversation);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create conversation' }, 
      { status: 500 }
    );
  }
}
