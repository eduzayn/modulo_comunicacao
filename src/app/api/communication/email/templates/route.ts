import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/email';
import withMetrics from '@/lib/with-metrics';

/**
 * GET /api/communication/email/templates
 * Get all email templates
 */
async function handleGetEmailTemplates(request: NextRequest) {
  try {
    const templates = await emailService.getTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/communication/email/templates
 * Create a new email template
 */
async function handleCreateEmailTemplate(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.subject || !body.body_html) {
      return NextResponse.json(
        { error: 'Name, subject, and body_html are required' },
        { status: 400 }
      );
    }
    
    const template = await emailService.createTemplate({
      name: body.name,
      subject: body.subject,
      body_html: body.body_html,
      body_text: body.body_text,
      variables: body.variables || [],
      is_active: body.is_active !== false
    });
    
    if (!template) {
      return NextResponse.json(
        { error: 'Failed to create email template' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(template);
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}

export const GET = withMetrics(handleGetEmailTemplates);
export const POST = withMetrics(handleCreateEmailTemplate);
