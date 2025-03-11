import { NextRequest, NextResponse } from 'next/server';
import { createBackup, listBackups } from '../../../../../services/backup';
import withMetrics from '../../../../../lib/with-metrics';

/**
 * POST /api/communication/backups/test-backup
 * Test endpoint to create a backup and verify it works
 */
async function handleTestBackup(request: NextRequest) {
  try {
    // Create a test backup with minimal options
    const backup = await createBackup({
      includeMessages: true,
      includeAttachments: false,
      format: 'json',
      compressionLevel: 5
    });
    
    // List backups to verify it was created
    const backups = await listBackups(10, 0);
    
    return NextResponse.json({
      success: true,
      message: 'Test backup created successfully',
      backup,
      recentBackups: backups.slice(0, 3), // Show only the 3 most recent backups
    });
  } catch (error) {
    console.error('Error creating test backup:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Check your Supabase connection and backup service configuration'
      },
      { status: 500 }
    );
  }
}

export const POST = withMetrics(handleTestBackup);
