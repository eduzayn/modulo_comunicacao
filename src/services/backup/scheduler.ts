import { scheduleBackups, createBackup, BackupOptions } from './index';
import { supabase } from '../../lib/supabase';
import { recordMetric } from '../metrics';

/**
 * Process scheduled backups
 */
export async function processScheduledBackups(): Promise<boolean> {
  try {
    // Get active schedules
    const { data: schedules, error } = await supabase
      .from('backup_schedules')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching backup schedules:', error);
      return false;
    }
    
    if (!schedules || schedules.length === 0) {
      return true; // No schedules to process
    }
    
    const now = new Date();
    let processedCount = 0;
    
    // Process each schedule
    for (const schedule of schedules) {
      try {
        // Check if it's time to run this schedule
        if (!schedule.next_run_at || new Date(schedule.next_run_at) <= now) {
          // Create backup using schedule options
          await createBackup(schedule.options || {});
          
          // Update schedule with last run and next run times
          const nextRun = calculateNextRunTime(schedule.schedule, now);
          
          await supabase
            .from('backup_schedules')
            .update({
              last_run_at: now.toISOString(),
              next_run_at: nextRun.toISOString(),
              updated_at: now.toISOString(),
            })
            .eq('id', schedule.id);
          
          processedCount++;
          
          // Record metric
          await recordMetric({
            type: 'custom',
            value: 1,
            tags: {
              metricName: 'backup_scheduled',
              scheduleId: schedule.id,
              schedule: schedule.schedule,
              success: 'true',
            },
          });
        }
      } catch (error) {
        console.error(`Error processing backup schedule ${schedule.id}:`, error);
        
        // Record error metric
        await recordMetric({
          type: 'custom',
          value: 1,
          tags: {
            metricName: 'backup_scheduled',
            scheduleId: schedule.id,
            schedule: schedule.schedule,
            success: 'false',
            error: error instanceof Error ? error.message.substring(0, 100) : 'Unknown error',
          },
        });
      }
    }
    
    console.log(`Processed ${processedCount} scheduled backups`);
    return true;
  } catch (error) {
    console.error('Error processing scheduled backups:', error);
    return false;
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
 * Register the backup scheduler with the queue system
 */
export function registerBackupScheduler() {
  try {
    const { registerProcessor } = require('../queue');
    
    registerProcessor('backup_scheduler', async () => {
      return await processScheduledBackups();
    });
  } catch (error) {
    console.error('Error registering backup scheduler:', error);
  }
}
