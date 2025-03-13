import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../../lib/supabase';
import withMetrics from '../../../../../lib/with-metrics';

/**
 * GET /api/communication/backups/metrics
 * Get backup metrics and statistics
 */
async function handleGetBackupMetrics(// // request: NextRequest) {
  try {
    // Get backup counts by status
    // Query for status counts manually
    const { data: backups, error: statusError } = await supabase
      .from('backups')
      .select('status');
    
    if (statusError) {
      console.error('Error fetching backup status counts:', statusError);
      throw new Error('Failed to fetch backup status counts');
    }
    
    // Get total size of all backups
    const { data: sizeData, error: sizeError } = await supabase
      .from('backups')
      .select('file_size')
      .eq('status', 'completed');
    
    if (sizeError) {
      console.error('Error fetching backup sizes:', sizeError);
      throw new Error('Failed to fetch backup sizes');
    }
    
    const totalSize = sizeData.reduce((sum: number, backup: unknown) => sum + (backup.file_size || 0), 0);
    
    // Get average backup duration from metrics
    const { data: durationData, error: durationError } = await supabase
      .from('metrics')
      .select('value, tags')
      .eq('type', 'custom')
      .filter('tags->metricName', 'eq', 'backup_duration')
      .filter('tags->status', 'eq', 'completed');
    
    if (durationError) {
      console.error('Error fetching backup durations:', durationError);
      throw new Error('Failed to fetch backup durations');
    }
    
    const avgDuration = durationData.length > 0
      ? durationData.reduce((sum: number, metric: unknown) => sum + metric.value, 0) / durationData.length
      : 0;
    
    // Count statuses manually
    const statusCountsMap: Record<string, number> = {};
    backups?.forEach((backup: { status: string }) => {
      statusCountsMap[backup.status] = (statusCountsMap[backup.status] || 0) + 1;
    });
    
    return NextResponse.json({
      totalBackups: backups?.length || 0,
      backupsByStatus: {
        pending: statusCountsMap.pending || 0,
        processing: statusCountsMap.processing || 0,
        completed: statusCountsMap.completed || 0,
        failed: statusCountsMap.failed || 0,
      },
      totalSize,
      averageDuration: avgDuration,
      successRate: statusCountsMap.completed > 0
        ? (statusCountsMap.completed / (statusCountsMap.completed + (statusCountsMap.failed || 0))) * 100
        : 0,
    });
  } catch (error) {
    console.error('Error fetching backup metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backup metrics' },
      { status: 500 }
    );
  }
}

export const GET = withMetrics(handleGetBackupMetrics);
