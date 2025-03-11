import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';
import withMetrics from '../../../../../lib/with-metrics';
import { recordMetric } from '../../../../../services/metrics';

/**
 * POST /api/communication/backups/cleanup
 * Clean up old backups based on retention policy
 */
async function handleCleanupBackups(request: NextRequest) {
  try {
    const body = await request.json();
    const { olderThan, status, keepCount } = body;
    
    // Build query to find backups to delete
    let query = supabase
      .from('backups')
      .select('id, file_name, created_at');
    
    // Apply filters
    if (olderThan) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThan);
      query = query.lt('created_at', cutoffDate.toISOString());
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Get backups to delete
    const { data: backupsToDelete, error: fetchError } = await query;
    
    if (fetchError) {
      console.error('Error fetching backups for cleanup:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch backups for cleanup' },
        { status: 500 }
      );
    }
    
    // Apply keep count if specified
    let backupsToRemove = backupsToDelete || [];
    if (keepCount && backupsToRemove.length > keepCount) {
      // Sort by created_at (newest first)
      backupsToRemove.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      // Keep the newest 'keepCount' backups
      backupsToRemove = backupsToRemove.slice(keepCount);
    }
    
    if (backupsToRemove.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No backups to clean up',
        deletedCount: 0,
      });
    }
    
    // Delete backups from storage
    const backupIds = backupsToRemove.map(b => b.id);
    const storagePromises = backupsToRemove
      .filter(b => b.file_name)
      .map(backup => 
        supabase.storage
          .from('backups')
          .remove([`${backup.id}/${backup.file_name}`])
      );
    
    await Promise.all(storagePromises);
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('backups')
      .delete()
      .in('id', backupIds);
    
    if (deleteError) {
      console.error('Error deleting backups during cleanup:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete backups during cleanup' },
        { status: 500 }
      );
    }
    
    // Record metric
    await recordMetric({
      type: 'custom',
      value: backupsToRemove.length,
      tags: {
        metricName: 'backup_cleanup',
        count: backupsToRemove.length.toString(),
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Backup cleanup completed successfully',
      deletedCount: backupsToRemove.length,
      deletedIds: backupIds,
    });
  } catch (error) {
    console.error('Error cleaning up backups:', error);
    return NextResponse.json(
      { error: 'Failed to clean up backups' },
      { status: 500 }
    );
  }
}

export const POST = withMetrics(handleCleanupBackups);
