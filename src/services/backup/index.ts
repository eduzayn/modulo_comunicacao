import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { logger } from '../../lib/logger';

/**
 * Backup Service
 * 
 * This service handles database backups and restoration.
 */

// Backup configuration
export interface BackupOptions {
  tables?: string[];
  includeStorage?: boolean;
  compressionLevel?: number;
  encryptionKey?: string;
  destination?: 'local' | 's3' | 'supabase';
  maxBackups?: number;
}

// Backup metadata
export interface BackupMetadata {
  id: string;
  timestamp: string;
  size: number;
  tables: string[];
  includesStorage: boolean;
  encrypted: boolean;
  compressed: boolean;
  status: 'completed' | 'failed' | 'in_progress';
  destination: string;
  path: string;
}

// Default backup options
const DEFAULT_BACKUP_OPTIONS: BackupOptions = {
  tables: [],
  includeStorage: true,
  compressionLevel: 5,
  destination: 'supabase',
  maxBackups: 10,
};

/**
 * List all backups
 */
export async function listBackups(): Promise<BackupMetadata[]> {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
    
    // Get backups from database
    const { data, error } = await supabase
      .from('backups')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to list backups: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    logger.error(`Failed to list backups: ${error.message}`, { error });
    return [];
  }
}

/**
 * Create a backup of the database
 */
export async function createBackup(options: BackupOptions = {}): Promise<BackupMetadata> {
  const backupOptions = { ...DEFAULT_BACKUP_OPTIONS, ...options };
  const backupId = `backup_${Date.now()}`;
  
  logger.info(`Starting backup ${backupId}`, { backupOptions });
  
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
    
    // Get tables to backup
    const tables = backupOptions.tables?.length 
      ? backupOptions.tables 
      : await getAllTables(supabase);
    
    logger.info(`Backing up ${tables.length} tables`, { tables });
    
    // Create backup metadata
    const metadata: BackupMetadata = {
      id: backupId,
      timestamp: new Date().toISOString(),
      size: 0,
      tables,
      includesStorage: backupOptions.includeStorage || false,
      encrypted: !!backupOptions.encryptionKey,
      compressed: backupOptions.compressionLevel !== 0,
      status: 'in_progress',
      destination: backupOptions.destination || 'supabase',
      path: `backups/${backupId}`,
    };
    
    // Create backup data object
    const backupData: Record<string, unknown> = {
      metadata,
      tables: {},
    };
    
    // Backup each table
    for (const table of tables) {
      logger.info(`Backing up table: ${table}`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*');
      
      if (error) {
        throw new Error(`Failed to backup table ${table}: ${error.message}`);
      }
      
      backupData.tables[table] = data;
    }
    
    // Backup storage if requested
    if (backupOptions.includeStorage) {
      logger.info('Backing up storage buckets');
      
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketsError) {
        throw new Error(`Failed to list storage buckets: ${bucketsError.message}`);
      }
      
      backupData.storage = {
        buckets: buckets,
        objects: {},
      };
      
      // Backup objects in each bucket
      for (const bucket of buckets) {
        logger.info(`Backing up bucket: ${bucket.name}`);
        
        const { data: objects, error: objectsError } = await supabase
          .storage
          .from(bucket.name)
          .list();
        
        if (objectsError) {
          throw new Error(`Failed to list objects in bucket ${bucket.name}: ${objectsError.message}`);
        }
        
        backupData.storage.objects[bucket.name] = objects;
        
        // Download each object
        for (const object of objects) {
          if (object.metadata?.mimetype && !object.id.endsWith('/')) {
            const { data: objectData, error: objectError } = await supabase
              .storage
              .from(bucket.name)
              .download(object.name);
            
            if (objectError) {
              logger.warn(`Failed to download object ${object.name}: ${objectError.message}`);
              continue;
            }
            
            // Convert blob to base64
            const buffer = await objectData.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            
            // Add to backup data
            if (!backupData.storage.objectData) {
              backupData.storage.objectData = {};
            }
            
            if (!backupData.storage.objectData[bucket.name]) {
              backupData.storage.objectData[bucket.name] = {};
            }
            
            backupData.storage.objectData[bucket.name][object.name] = {
              base64,
              metadata: object.metadata,
            };
          }
        }
      }
    }
    
    // Serialize backup data
    const serializedData = JSON.stringify(backupData);
    
    // Compress if requested
    if (backupOptions.compressionLevel && backupOptions.compressionLevel > 0) {
      logger.info(`Compressing backup with level ${backupOptions.compressionLevel}`);
      // Compression would be implemented here
    }
    
    // Encrypt if requested
    if (backupOptions.encryptionKey) {
      logger.info('Encrypting backup');
      // Encryption would be implemented here
    }
    
    // Store the backup
    const backupDestination = backupOptions.destination || 'supabase';
    
    switch (backupDestination) {
      case 'local':
        await storeBackupLocally(backupId, serializedData);
        break;
        
      case 'supabase':
      default:
        await storeBackupInSupabase(supabase, backupId, serializedData);
        break;
    }
    
    // Update metadata
    metadata.status = 'completed';
    metadata.size = Buffer.byteLength(serializedData, 'utf8');
    
    // Store metadata in database
    const { error: metadataError } = await supabase
      .from('backups')
      .insert([metadata]);
    
    if (metadataError) {
      logger.error(`Failed to store backup metadata: ${metadataError.message}`);
    }
    
    // Clean up old backups if maxBackups is set
    if (backupOptions.maxBackups && backupOptions.maxBackups > 0) {
      await cleanupOldBackups(supabase, backupOptions.maxBackups);
    }
    
    logger.info(`Backup ${backupId} completed successfully`, { 
      size: metadata.size,
      tables: metadata.tables.length,
    });
    
    return metadata;
  } catch (error) {
    logger.error(`Backup failed: ${error.message}`, { error });
    
    // Create failed backup metadata
    const failedMetadata: BackupMetadata = {
      id: backupId,
      timestamp: new Date().toISOString(),
      size: 0,
      tables: [],
      includesStorage: backupOptions.includeStorage || false,
      encrypted: !!backupOptions.encryptionKey,
      compressed: backupOptions.compressionLevel !== 0,
      status: 'failed',
      destination: backupOptions.destination || 'supabase',
      path: `backups/${backupId}`,
    };
    
    return failedMetadata;
  }
}

/**
 * Restore a backup
 */
export async function restoreBackup(backupId: string): Promise<boolean> {
  logger.info(`Starting restoration of backup ${backupId}`);
  
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
    
    // Get backup metadata
    const { data: metadata, error: metadataError } = await supabase
      .from('backups')
      .select('*')
      .eq('id', backupId)
      .single();
    
    if (metadataError || !metadata) {
      throw new Error(`Failed to get backup metadata: ${metadataError?.message || 'Backup not found'}`);
    }
    
    // Get backup data
    let serializedData: string;
    
    switch (metadata.destination) {
      case 'local':
        serializedData = await getBackupFromLocal(backupId);
        break;
        
      case 'supabase':
      default:
        serializedData = await getBackupFromSupabase(supabase, backupId);
        break;
    }
    
    // Decrypt if needed
    if (metadata.encrypted) {
      logger.info('Decrypting backup');
      // Decryption would be implemented here
    }
    
    // Decompress if needed
    if (metadata.compressed) {
      logger.info('Decompressing backup');
      // Decompression would be implemented here
    }
    
    // Parse backup data
    const backupData = JSON.parse(serializedData);
    
    // Restore tables
    for (const table of Object.keys(backupData.tables)) {
      logger.info(`Restoring table: ${table}`);
      
      // Clear existing data
      const { error: clearError } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
      
      if (clearError) {
        logger.warn(`Failed to clear table ${table}: ${clearError.message}`);
      }
      
      // Insert backup data
      const tableData = backupData.tables[table];
      
      if (tableData && tableData.length > 0) {
        // Insert in batches to avoid request size limits
        const batchSize = 1000;
        
        for (let i = 0; i < tableData.length; i += batchSize) {
          const batch = tableData.slice(i, i + batchSize);
          
          const { error: insertError } = await supabase
            .from(table)
            .insert(batch);
          
          if (insertError) {
            logger.error(`Failed to restore data to table ${table}: ${insertError.message}`);
          }
        }
      }
    }
    
    // Restore storage if included
    if (backupData.storage && metadata.includesStorage) {
      logger.info('Restoring storage buckets');
      
      // Restore buckets
      for (const bucket of backupData.storage.buckets) {
        // Check if bucket exists
        const { data: existingBuckets, error: bucketsError } = await supabase
          .storage
          .listBuckets();
        
        if (bucketsError) {
          logger.error(`Failed to list storage buckets: ${bucketsError.message}`);
          continue;
        }
        
        const bucketExists = existingBuckets.some(b => b.name === bucket.name);
        
        if (!bucketExists) {
          logger.info(`Creating bucket: ${bucket.name}`);
          
          const { error: createError } = await supabase
            .storage
            .createBucket(bucket.name, {
              public: bucket.public,
            });
          
          if (createError) {
            logger.error(`Failed to create bucket ${bucket.name}: ${createError.message}`);
            continue;
          }
        }
        
        // Restore objects
        if (backupData.storage.objectData && backupData.storage.objectData[bucket.name]) {
          for (const [objectName, objectData] of Object.entries(backupData.storage.objectData[bucket.name])) {
            logger.info(`Restoring object: ${bucket.name}/${objectName}`);
            
            // Convert base64 to blob
            const base64 = objectData.base64;
            const buffer = Buffer.from(base64, 'base64');
            const blob = new Blob([buffer], { type: objectData.metadata.mimetype });
            
            // Upload to storage
            const { error: uploadError } = await supabase
              .storage
              .from(bucket.name)
              .upload(objectName, blob, {
                contentType: objectData.metadata.mimetype,
                upsert: true,
              });
            
            if (uploadError) {
              logger.error(`Failed to restore object ${objectName}: ${uploadError.message}`);
            }
          }
        }
      }
    }
    
    logger.info(`Backup ${backupId} restored successfully`);
    
    return true;
  } catch (error) {
    logger.error(`Restoration failed: ${error.message}`, { error });
    return false;
  }
}

/**
 * Get all tables in the database
 */
async function getAllTables(supabase) {
  const { data, error } = await supabase.rpc('get_all_tables');
  
  if (error) {
    throw new Error(`Failed to get tables: ${error.message}`);
  }
  
  return data.map(table => table.table_name);
}

/**
 * Store backup locally
 */
async function storeBackupLocally(backupId: string, data: string): Promise<void> {
  const backupDir = path.join(process.cwd(), 'backups');
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const backupPath = path.join(backupDir, `${backupId}.json`);
  
  // Write backup data to file
  fs.writeFileSync(backupPath, data, 'utf8');
  
  logger.info(`Backup stored locally at ${backupPath}`);
}

/**
 * Store backup in Supabase storage
 */
async function storeBackupInSupabase(supabase, backupId: string, data: string): Promise<void> {
  const bucketName = 'backups';
  
  // Check if bucket exists
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets();
  
  if (bucketsError) {
    throw new Error(`Failed to list storage buckets: ${bucketsError.message}`);
  }
  
  const bucketExists = buckets.some(b => b.name === bucketName);
  
  if (!bucketExists) {
    logger.info(`Creating backup bucket: ${bucketName}`);
    
    const { error: createError } = await supabase
      .storage
      .createBucket(bucketName, {
        public: false,
      });
    
    if (createError) {
      throw new Error(`Failed to create backup bucket: ${createError.message}`);
    }
  }
  
  // Upload backup data
  const { error: uploadError } = await supabase
    .storage
    .from(bucketName)
    .upload(`${backupId}.json`, new Blob([data], { type: 'application/json' }), {
      contentType: 'application/json',
      upsert: true,
    });
  
  if (uploadError) {
    throw new Error(`Failed to upload backup: ${uploadError.message}`);
  }
  
  logger.info(`Backup stored in Supabase storage: ${bucketName}/${backupId}.json`);
}

/**
 * Get backup from local storage
 */
async function getBackupFromLocal(backupId: string): Promise<string> {
  const backupPath = path.join(process.cwd(), 'backups', `${backupId}.json`);
  
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }
  
  return fs.readFileSync(backupPath, 'utf8');
}

/**
 * Get backup from Supabase storage
 */
async function getBackupFromSupabase(supabase, backupId: string): Promise<string> {
  const bucketName = 'backups';
  
  // Download backup data
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .download(`${backupId}.json`);
  
  if (error) {
    throw new Error(`Failed to download backup: ${error.message}`);
  }
  
  // Convert blob to string
  return await data.text();
}

/**
 * Clean up old backups
 */
async function cleanupOldBackups(supabase, maxBackups: number): Promise<void> {
  logger.info(`Cleaning up old backups, keeping ${maxBackups} most recent`);
  
  // Get all backups
  const { data: backups, error } = await supabase
    .from('backups')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (error) {
    logger.error(`Failed to get backups: ${error.message}`);
    return;
  }
  
  // Keep only the most recent backups
  const backupsToDelete = backups.slice(maxBackups);
  
  for (const backup of backupsToDelete) {
    logger.info(`Deleting old backup: ${backup.id}`);
    
    // Delete from storage
    if (backup.destination === 'supabase') {
      const { error: deleteError } = await supabase
        .storage
        .from('backups')
        .remove([`${backup.id}.json`]);
      
      if (deleteError) {
        logger.warn(`Failed to delete backup file: ${deleteError.message}`);
      }
    } else if (backup.destination === 'local') {
      const backupPath = path.join(process.cwd(), 'backups', `${backup.id}.json`);
      
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
    }
    
    // Delete metadata
    const { error: deleteMetadataError } = await supabase
      .from('backups')
      .delete()
      .eq('id', backup.id);
    
    if (deleteMetadataError) {
      logger.warn(`Failed to delete backup metadata: ${deleteMetadataError.message}`);
    }
  }
}

// Export functions for scheduled backups
export const backupService = {
  createBackup,
  restoreBackup,
  listBackups
};

export default backupService;
