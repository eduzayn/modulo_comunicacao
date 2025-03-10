import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../../lib/supabase';
import withMetrics from '../../../../../../lib/with-metrics';

/**
 * GET /api/communication/backups/scheduler/status
 * Get the status of the backup scheduler
 */
async function handleGetSchedulerStatus(request: NextRequest) {
  try {
    // Get all backup schedules
    const { data: schedules, error } = await supabase
      .from('backup_schedules')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching backup schedules:', error);
      return NextResponse.json(
        { error: 'Failed to fetch backup schedules' },
        { status: 500 }
      );
    }
    
    // Get recent backup jobs
    const { data: recentJobs, error: jobsError } = await supabase
      .from('queue_jobs')
      .select('*')
      .eq('type', 'backup_scheduler')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (jobsError) {
      console.error('Error fetching recent scheduler jobs:', jobsError);
    }
    
    // Get metrics for scheduler
    const { data: metrics, error: metricsError } = await supabase
      .from('metrics')
      .select('*')
      .eq('type', 'custom')
      .filter('tags->metricName', 'eq', 'backup_scheduled')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (metricsError) {
      console.error('Error fetching scheduler metrics:', metricsError);
    }
    
    // Calculate success rate
    let successRate = 0;
    if (metrics && metrics.length > 0) {
      const successCount = metrics.filter(m => m.tags?.success === 'true').length;
      successRate = (successCount / metrics.length) * 100;
    }
    
    // Calculate next scheduled runs
    const now = new Date();
    const schedulesWithNextRun = schedules?.map(schedule => {
      // If next_run_at is in the past, calculate a new one
      let nextRunAt = schedule.next_run_at ? new Date(schedule.next_run_at) : null;
      
      if (!nextRunAt || nextRunAt < now) {
        nextRunAt = calculateNextRunTime(schedule.schedule, now);
      }
      
      return {
        ...schedule,
        next_run_at: nextRunAt?.toISOString(),
        time_until_next_run: nextRunAt ? formatTimeUntil(nextRunAt, now) : 'Unknown',
      };
    });
    
    return NextResponse.json({
      schedules: schedulesWithNextRun || [],
      activeSchedules: schedules?.filter(s => s.is_active).length || 0,
      totalSchedules: schedules?.length || 0,
      recentJobs: recentJobs || [],
      metrics: {
        successRate,
        recentRuns: metrics?.length || 0,
        successfulRuns: metrics?.filter(m => m.tags?.success === 'true').length || 0,
        failedRuns: metrics?.filter(m => m.tags?.success === 'false').length || 0,
      },
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json(
      { error: 'Failed to get scheduler status' },
      { status: 500 }
    );
  }
}

/**
 * Calculate the next run time based on schedule type
 */
function calculateNextRunTime(schedule: string, fromDate: Date = new Date()): Date {
  const nextRun = new Date(fromDate);
  
  switch (schedule) {
    case 'daily':
      nextRun.setDate(nextRun.getDate() + 1);
      nextRun.setHours(0, 0, 0, 0); // Run at midnight
      break;
    case 'weekly':
      nextRun.setDate(nextRun.getDate() + 7);
      nextRun.setHours(0, 0, 0, 0); // Run at midnight
      break;
    case 'monthly':
      nextRun.setMonth(nextRun.getMonth() + 1);
      nextRun.setDate(1); // First day of next month
      nextRun.setHours(0, 0, 0, 0); // Run at midnight
      break;
    default:
      nextRun.setDate(nextRun.getDate() + 1); // Default to daily
      nextRun.setHours(0, 0, 0, 0); // Run at midnight
  }
  
  return nextRun;
}

/**
 * Format time until a date in a human-readable format
 */
function formatTimeUntil(date: Date, now: Date = new Date()): string {
  const diffMs = date.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return 'Overdue';
  }
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  } else {
    return `${diffSecs} second${diffSecs > 1 ? 's' : ''}`;
  }
}

export const GET = withMetrics(handleGetSchedulerStatus);
