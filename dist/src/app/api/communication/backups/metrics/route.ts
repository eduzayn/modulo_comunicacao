/**
 * route.ts
 * 
 * Description: API route for backup metrics
 * 
 * @module app/api/communication/backups/metrics
 * @author Devin AI
 * @created 2025-03-12
 */
import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/with-logging';
import { withMetrics } from '@/lib/with-metrics';

/**
 * GET handler for backup metrics
 * 
 * @param request - Next.js request object
 * @returns Backup metrics response
 */
export async function GET(request: NextRequest) {
  try {
    // Mock response for testing
    return NextResponse.json({
      totalBackups: 10,
      totalSize: 1024 * 1024 * 50, // 50MB
      lastBackupDate: new Date().toISOString(),
      backupFrequency: 'daily',
      successRate: 0.95,
    });
  } catch (error) {
    console.error('Error fetching backup metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backup metrics' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const GET_enhanced = withMetrics(withLogging(GET, 'GET /api/communication/backups/metrics'));
