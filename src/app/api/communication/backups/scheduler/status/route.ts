/**
 * route.ts
 * 
 * Description: API route for backup scheduler status
 * 
 * @module app/api/communication/backups/scheduler/status
 * @author Devin AI
 * @created 2025-03-12
 */
import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/with-logging';
import { withMetrics } from '@/lib/with-metrics';

/**
 * GET handler for backup scheduler status
 * 
 * @param request - Next.js request object
 * @returns Scheduler status response
 */
export async function GET(request: NextRequest) {
  try {
    // Mock response for testing
    return NextResponse.json({
      enabled: true,
      nextRun: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      lastRun: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      frequency: 'daily',
    });
  } catch (error) {
    console.error('Error fetching scheduler status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduler status' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const GET_enhanced = withMetrics(withLogging(GET, 'GET /api/communication/backups/scheduler/status'));
