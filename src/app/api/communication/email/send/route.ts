import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/email';
import withMetrics from '@/lib/with-metrics';

/**
 * POST /api/communication/email/send
 * Send an email
 */
async function handleSendEmail(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.to || !body.subject) {
      return NextResponse.json(
        { error: 'Recipient (to) and subject are required' },
        { status: 400 }
      );
    }
    
    let result;
    
    if (body.templateId) {
      // Send using template
      result = await emailService.sendWithTemplate(
        body.to,
        body.templateId,
        body.variables || {}
      );
    } else if (body.html) {
      // Send direct email
      result = await emailService.sendDirect(
        body.to,
        body.subject,
        body.html,
        body.text
      );
    } else {
      return NextResponse.json(
        { error: 'Either templateId or html content is required' },
        { status: 400 }
      );
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      id: result.id
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

export const POST = withMetrics(handleSendEmail);
