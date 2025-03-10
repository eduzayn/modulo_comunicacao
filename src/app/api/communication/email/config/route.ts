import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/email';
import withMetrics from '@/lib/with-metrics';

/**
 * GET /api/communication/email/config
 * Get the default email configuration
 */
async function handleGetEmailConfig(request: NextRequest) {
  try {
    const config = await emailService.getDefaultConfig();
    
    if (!config) {
      return NextResponse.json(
        { error: 'Email configuration not found' },
        { status: 404 }
      );
    }
    
    // Don't return the password in the response
    const { smtp_password, ...safeConfig } = config;
    
    return NextResponse.json(safeConfig);
  } catch (error) {
    console.error('Error fetching email config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email configuration' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/communication/email/config
 * Update the email configuration
 */
async function handleUpdateEmailConfig(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Configuration ID is required' },
        { status: 400 }
      );
    }
    
    const updatedConfig = await emailService.updateConfig(body);
    
    if (!updatedConfig) {
      return NextResponse.json(
        { error: 'Failed to update email configuration' },
        { status: 500 }
      );
    }
    
    // Don't return the password in the response
    const { smtp_password, ...safeConfig } = updatedConfig;
    
    return NextResponse.json(safeConfig);
  } catch (error) {
    console.error('Error updating email config:', error);
    return NextResponse.json(
      { error: 'Failed to update email configuration' },
      { status: 500 }
    );
  }
}

export const GET = withMetrics(handleGetEmailConfig);
export const PUT = withMetrics(handleUpdateEmailConfig);
