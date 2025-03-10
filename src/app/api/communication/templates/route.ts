import { NextResponse } from 'next/server';
import { getTemplates, createTemplate } from '../../../../services/supabase/templates';
import { z } from 'zod';

const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
  channelType: z.enum(['whatsapp', 'email', 'chat', 'sms', 'push']),
  category: z.string().optional(),
  variables: z.array(z.string()).optional(),
  status: z.enum(['draft', 'active', 'archived'])
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params = {
      channelType: searchParams.get('channelType') as any || undefined,
      status: searchParams.get('status') as any || undefined,
      category: searchParams.get('category') || undefined
    };
    
    const templates = await getTemplates(params);
    return NextResponse.json(templates);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch templates' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = createTemplateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid template data', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    // Transform the data to match the database schema
    const templateData = {
      name: result.data.name,
      content: result.data.content,
      channel_type: result.data.channelType,
      category: result.data.category,
      variables: result.data.variables || [],
      status: result.data.status
    };
    
    const template = await createTemplate(templateData as any);
    return NextResponse.json(template);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create template' }, 
      { status: 500 }
    );
  }
}
