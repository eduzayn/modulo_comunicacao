/**
 * route.ts
 * 
 * Description: API route for toggling backup scheduler
 * 
 * @module app/api/communication/backups/scheduler/toggle
 * @author Devin AI
 * @created 2025-03-12
 */
import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/with-logging';
import { withMetrics } from '@/lib/with-metrics';

/**
 * POST handler for toggling backup scheduler
 * 
 * @param request - Next.js request object
 * @returns Scheduler toggle response
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { enabled } = data;
    
    // Mock response for testing
    return NextResponse.json({
      success: true,
      enabled: enabled,
      message: `Backup scheduler ${enabled ? 'enabled' : 'disabled'} successfully`,
    });
  } catch (error) {
    console.error('Error toggling backup scheduler:', error);
    return NextResponse.json(
      { error: 'Failed to toggle backup scheduler' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const POST_enhanced = withMetrics(withLogging(POST, 'POST /api/communication/backups/scheduler/toggle'));
