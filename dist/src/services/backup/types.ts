import { BackupOptions } from './index';

export interface BackupJob {
  id: string;
  backupId: string;
  options: BackupOptions;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackupSchedule {
  id: string;
  schedule: 'daily' | 'weekly' | 'monthly';
  options: BackupOptions;
  isActive: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt: string;
  updatedAt: string;
}
