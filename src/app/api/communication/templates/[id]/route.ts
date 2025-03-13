import { NextResponse } from 'next/server';
import { getTemplateById, updateTemplate, deleteTemplate } from '../../../../../services/supabase/templates';
import { z } from 'zod';

interface Params {
  params: {
    id: string;
  };
}

const updateTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  channelType: z.enum(['whatsapp', 'email', 'chat', 'sms', 'push']).optional(),
  category: z.string().optional(),
  variables: z.array(z.string()).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional()
});

export async function GET(request: Request, { params }: Params) {
  try {
    const template = await getTemplateById(params.id);
    return NextResponse.json(template);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch template' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = updateTemplateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid template data', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    // Transform the data to match the database schema
    const templateData: any = {};
    if (result.data.name) templateData.name = result.data.name;
    if (result.data.content) templateData.content = result.data.content;
    if (result.data.channelType) templateData.channel_type = result.data.channelType;
    if (result.data.category) templateData.category = result.data.category;
    if (result.data.variables) templateData.variables = result.data.variables;
    if (result.data.status) templateData.status = result.data.status;
    
    const template = await updateTemplate(params.id, templateData);
    return NextResponse.json(template);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error.message || 'Failed to update template' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await deleteTemplate(params.id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete template' }, 
      { status: 500 }
    );
  }
}
