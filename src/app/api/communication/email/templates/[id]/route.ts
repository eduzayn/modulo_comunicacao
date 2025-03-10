import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/email';
import withMetrics from '@/lib/with-metrics';

/**
 * GET /api/communication/email/templates/[id]
 * Get a specific email template
 */
async function handleGetEmailTemplate(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await emailService.getTemplate(params.id);
    
    if (!template) {
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching email template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email template' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/communication/email/templates/[id]
 * Update an email template
 */
async function handleUpdateEmailTemplate(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const template = await emailService.updateTemplate({
      id: params.id,
      ...body
    });
    
    if (!template) {
      return NextResponse.json(
        { error: 'Failed to update email template' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      { error: 'Failed to update email template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/communication/email/templates/[id]
 * Delete an email template (soft delete by setting is_active to false)
 */
async function handleDeleteEmailTemplate(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await emailService.updateTemplate({
      id: params.id,
      is_active: false
    });
    
    if (!template) {
      return NextResponse.json(
        { error: 'Failed to delete email template' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json(
      { error: 'Failed to delete email template' },
      { status: 500 }
    );
  }
}

export const GET = withMetrics(handleGetEmailTemplate);
export const PUT = withMetrics(handleUpdateEmailTemplate);
export const DELETE = withMetrics(handleDeleteEmailTemplate);
