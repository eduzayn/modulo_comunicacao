/**
 * route.ts
 * 
 * Description: API route for verifying backups
 * 
 * @module app/api/communication/backups/verify
 * @author Devin AI
 * @created 2025-03-12
 */
import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/with-logging';
import { withMetrics } from '@/lib/with-metrics';

/**
 * GET handler for verifying backups
 * 
 * @param request - Next.js request object
 * @returns Backup verification response
 */
export async function GET(request: NextRequest) {
  try {
    // Mock response for testing
    return NextResponse.json({
      verified: true,
      lastVerified: new Date().toISOString(),
      backupCount: 5,
      totalSize: 1024 * 1024 * 50, // 50MB
      oldestBackup: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
      newestBackup: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error verifying backups:', error);
    return NextResponse.json(
      { error: 'Failed to verify backups' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const GET_enhanced = withMetrics(withLogging(GET, 'GET /api/communication/backups/verify'));
