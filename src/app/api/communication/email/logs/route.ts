import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/email';
import withMetrics from '@/lib/with-metrics';

/**
 * GET /api/communication/email/logs
 * Get email logs with pagination
 */
async function handleGetEmailLogs(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    const logs = await emailService.getLogs(limit, offset);
    
    return NextResponse.json({
      logs,
      pagination: {
        limit,
        offset,
        total: logs.length // This is not accurate for total count, just a placeholder
      }
    });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email logs' },
      { status: 500 }
    );
  }
}

export const GET = withMetrics(handleGetEmailLogs);
