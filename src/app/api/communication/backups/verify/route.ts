import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';
import withMetrics from '../../../../../lib/with-metrics';

/**
 * GET /api/communication/backups/verify
 * Verify backup system health and configuration
 */
async function handleVerifyBackupSystem(// // request: NextRequest) {
  try {
    // Check database connection
    const { data: dbCheck, error: dbError } = await supabase
      .from('backups')
      .select('count(*)', { count: 'exact', head: true });
    
    // Check storage access
    const { data: storageCheck, error: storageError } = await supabase
      .storage
      .getBucket('backups');
    
    // Check queue system
    const { data: queueCheck, error: queueError } = await supabase
      .from('queue_jobs')
      .select('count(*)', { count: 'exact', head: true })
      .eq('type', 'backup');
    
    // Check metrics system
    const { data: metricsCheck, error: metricsError } = await supabase
      .from('metrics')
      .select('count(*)', { count: 'exact', head: true })
      .eq('type', 'custom')
      .filter('tags->metricName', 'eq', 'backup_duration');
    
    return NextResponse.json({
      success: true,
      database: {
        connected: !dbError,
        error: dbError ? dbError.message : null,
      },
      storage: {
        connected: !storageError,
        bucketExists: !!storageCheck,
        error: storageError ? storageError.message : null,
      },
      queue: {
        connected: !queueError,
        error: queueError ? queueError.message : null,
      },
      metrics: {
        connected: !metricsError,
        error: metricsError ? metricsError.message : null,
      },
      message: 'Backup system verification completed',
    });
  } catch (error) {
    console.error('Error verifying backup system:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Check your Supabase connection and permissions'
      },
      { status: 500 }
    );
  }
}

export const GET = withMetrics(handleVerifyBackupSystem);
