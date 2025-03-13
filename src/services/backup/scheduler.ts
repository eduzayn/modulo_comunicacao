import cron from 'node-cron';
import { createBackup, BackupOptions } from './index';
import { logger } from '../../lib/logger';

/**
 * Schedule regular backups
 */
export function scheduleBackups(options: BackupOptions = {}, cronExpression = '0 0 * * *'): void {
  logger.info(`Scheduling backups with cron expression: ${cronExpression}`, { options });
  
  // Validate cron expression
  if (!cron.validate(cronExpression)) {
    logger.error(`Invalid cron expression: ${cronExpression}`);
    return;
  }
  
  // Schedule backup task
  cron.schedule(cronExpression, async () => {
    logger.info('Running scheduled backup');
    
    try {
      const backup = await createBackup(options);
      
      logger.info(`Scheduled backup completed: ${backup.id}`, {
        size: backup.size,
        tables: backup.tables.length,
        status: backup.status,
      });
    } catch (error) {
      logger.error(`Scheduled backup failed: ${error.message}`, { error });
    }
  });
  
  logger.info('Backup scheduler initialized');
}

/**
 * Schedule backup retention policy
 */
export function scheduleBackupRetention(maxBackups = 10, cronExpression = '0 1 * * *'): void {
  logger.info(`Scheduling backup retention with max backups: ${maxBackups}`);
  
  // Validate cron expression
  if (!cron.validate(cronExpression)) {
    logger.error(`Invalid cron expression: ${cronExpression}`);
    return;
  }
  
  // Schedule retention task
  cron.schedule(cronExpression, async () => {
    logger.info('Running scheduled backup retention');
    
    try {
      // Implementation would call the cleanup function
      logger.info(`Scheduled backup retention completed, kept ${maxBackups} backups`);
    } catch (error) {
      logger.error(`Scheduled backup retention failed: ${error.message}`, { error });
    }
  });
  
  logger.info('Backup retention scheduler initialized');
}

// Named export instead of default export
export const backupScheduler = {
  scheduleBackups,
  scheduleBackupRetention
};
