import { supabase } from '../../lib/supabase';
import { recordMetric } from '../metrics';
import { enqueue } from '../queue';

export interface BackupOptions {
  includeMessages?: boolean;
  includeAttachments?: boolean;
  conversationIds?: string[];
  startDate?: string;
  endDate?: string;
  format?: 'json' | 'csv';
  compressionLevel?: number;
}

export interface BackupResult {
  id: string;
  fileName: string;
  fileSize: number;
  url?: string;
  expiresAt?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: string;
}

/**
 * Create a backup of conversations
 */
export async function createBackup(options: BackupOptions = {}): Promise<BackupResult> {
  try {
    const {
      includeMessages = true,
      includeAttachments = false,
      conversationIds,
      startDate,
      endDate,
      format = 'json',
      compressionLevel = 5,
    } = options;
    
    // Create a backup record
    const { data: backup, error } = await supabase
      .from('backups')
      .insert({
        options: {
          includeMessages,
          includeAttachments,
          conversationIds,
          startDate,
          endDate,
          format,
          compressionLevel,
        },
        status: 'pending',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating backup record:', error);
      throw new Error('Failed to create backup record');
    }
    
    // Enqueue a backup job
    await enqueue('backup', {
      backupId: backup.id,
      options,
    });
    
    return {
      id: backup.id,
      fileName: `backup_${backup.id}.${format === 'json' ? 'json.gz' : 'csv.gz'}`,
      fileSize: 0,
      status: 'pending',
      createdAt: backup.created_at,
    };
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
}

/**
 * Get a backup by ID
 */
export async function getBackup(id: string): Promise<BackupResult | null> {
  try {
    const { data: backup, error } = await supabase
      .from('backups')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching backup:', error);
      return null;
    }
    
    if (!backup) {
      return null;
    }
    
    return {
      id: backup.id,
      fileName: backup.file_name || `backup_${backup.id}.${backup.options?.format === 'csv' ? 'csv.gz' : 'json.gz'}`,
      fileSize: backup.file_size || 0,
      url: backup.url,
      expiresAt: backup.expires_at,
      status: backup.status,
      error: backup.error,
      createdAt: backup.created_at,
    };
  } catch (error) {
    console.error('Error fetching backup:', error);
    return null;
  }
}

/**
 * List all backups
 */
export async function listBackups(limit = 10, offset = 0): Promise<BackupResult[]> {
  try {
    const { data: backups, error } = await supabase
      .from('backups')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error listing backups:', error);
      return [];
    }
    
    return backups.map(backup => ({
      id: backup.id,
      fileName: backup.file_name || `backup_${backup.id}.${backup.options?.format === 'csv' ? 'csv.gz' : 'json.gz'}`,
      fileSize: backup.file_size || 0,
      url: backup.url,
      expiresAt: backup.expires_at,
      status: backup.status,
      error: backup.error,
      createdAt: backup.created_at,
    }));
  } catch (error) {
    console.error('Error listing backups:', error);
    return [];
  }
}

/**
 * Process a backup job
 */
export async function processBackup(backupId: string, options: BackupOptions): Promise<boolean> {
  const startTime = Date.now();
  let success = false;
  
  try {
    // Update backup status to processing
    await supabase
      .from('backups')
      .update({ status: 'processing' })
      .eq('id', backupId);
    
    // Extract conversations based on filters
    const {
      includeMessages = true,
      includeAttachments = false,
      conversationIds,
      startDate,
      endDate,
      format = 'json',
    } = options;
    
    // Build query for conversations
    let query = supabase.from('conversations').select(
      includeMessages ? 'id, title, status, created_at, updated_at, messages(*)' : '*'
    );
    
    // Apply filters
    if (conversationIds && conversationIds.length > 0) {
      query = query.in('id', conversationIds);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    // Fetch conversations
    const { data: conversations, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }
    
    // Process attachments if needed
    if (includeAttachments && conversations && Array.isArray(conversations)) {
      try {
        // Fetch attachments for all messages
        const messageIds: string[] = [];
        
        // Safely extract message IDs
        for (const conv of conversations as any[]) {
          if (conv && typeof conv === 'object' && 'messages' in conv && Array.isArray(conv.messages)) {
            for (const msg of conv.messages) {
              if (msg && typeof msg === 'object' && 'id' in msg) {
                messageIds.push(msg.id as string);
              }
            }
          }
        }
        
        if (messageIds.length > 0) {
          const { data: attachments } = await supabase
            .from('attachments')
            .select('*')
            .in('message_id', messageIds);
          
          // Add attachments to their respective messages
          if (attachments) {
            for (const conv of conversations as any[]) {
              if (conv && typeof conv === 'object' && 'messages' in conv && Array.isArray(conv.messages)) {
                for (const msg of conv.messages) {
                  if (msg && typeof msg === 'object' && 'id' in msg) {
                    (msg as any).attachments = attachments.filter(att => att.message_id === msg.id);
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing attachments:', error);
        // Continue without attachments
      }
    }
    
    // Generate backup file
    const backupData = format === 'json' 
      ? JSON.stringify(conversations)
      : convertToCSV(conversations);
    
    // Compress data
    const compressedData = await compressData(backupData);
    
    // Upload to storage
    const fileName = `backups/backup_${backupId}.${format === 'json' ? 'json.gz' : 'csv.gz'}`;
    
    const { error: uploadError } = await supabase.storage
      .from('communication')
      .upload(fileName, compressedData, {
        contentType: format === 'json' ? 'application/json+gzip' : 'text/csv+gzip',
        cacheControl: '3600',
      });
    
    if (uploadError) {
      throw new Error(`Failed to upload backup: ${uploadError.message}`);
    }
    
    // Generate signed URL
    const { data: urlData } = await supabase.storage
      .from('communication')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days
    
    // Update backup record
    const fileSize = compressedData.byteLength;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await supabase
      .from('backups')
      .update({
        status: 'completed',
        file_name: fileName,
        file_size: fileSize,
        url: urlData?.signedUrl,
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', backupId);
    
    // Record metrics
    await recordMetric({
      type: 'backup_size',
      value: fileSize,
      tags: {
        backupId,
        format,
      },
    });
    
    await recordMetric({
      type: 'backup_duration',
      value: Date.now() - startTime,
      tags: {
        backupId,
        format,
      },
    });
    
    await recordMetric({
      type: 'backup_completed',
      value: 1,
      tags: {
        backupId,
        success: 'true',
      },
    });
    
    success = true;
    return true;
  } catch (error) {
    console.error('Error processing backup:', error);
    
    // Update backup record with error
    await supabase
      .from('backups')
      .update({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', backupId);
    
    // Record error metric
    await recordMetric({
      type: 'backup_completed',
      value: 1,
      tags: {
        backupId,
        success: 'false',
        error: error instanceof Error ? error.message.substring(0, 100) : 'Unknown error',
      },
    });
    
    return false;
  } finally {
    // Record processing time metric
    await recordMetric({
      type: 'backup_duration',
      value: Date.now() - startTime,
      tags: {
        backupId,
        success: success.toString(),
      },
    });
  }
}

/**
 * Schedule automatic backups
 */
export async function scheduleBackups(
  schedule: 'daily' | 'weekly' | 'monthly',
  options: BackupOptions = {}
): Promise<boolean> {
  try {
    // Create or update backup schedule
    const { error } = await supabase
      .from('backup_schedules')
      .upsert({
        schedule,
        options,
        is_active: true,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error scheduling backups:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error scheduling backups:', error);
    return false;
  }
}

/**
 * Get backup schedules
 */
export async function getBackupSchedules(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('backup_schedules')
      .select('*');
    
    if (error) {
      console.error('Error fetching backup schedules:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching backup schedules:', error);
    return [];
  }
}

/**
 * Helper function to compress data
 */
async function compressData(data: string): Promise<Uint8Array> {
  // In a real implementation, we would use a compression library
  // For this example, we'll just return the data as a Uint8Array
  const encoder = new TextEncoder();
  return encoder.encode(data);
}

/**
 * Helper function to convert data to CSV
 */
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return '';
  }
  
  // Flatten conversations and messages into rows
  const rows: any[] = [];
  
  for (const conv of data) {
    if (conv.messages && conv.messages.length > 0) {
      for (const msg of conv.messages) {
        rows.push({
          conversation_id: conv.id,
          conversation_title: conv.title,
          conversation_status: conv.status,
          conversation_created_at: conv.created_at,
          message_id: msg.id,
          message_content: msg.content,
          message_sender: msg.sender,
          message_created_at: msg.created_at,
        });
      }
    } else {
      rows.push({
        conversation_id: conv.id,
        conversation_title: conv.title,
        conversation_status: conv.status,
        conversation_created_at: conv.created_at,
      });
    }
  }
  
  // Get all unique headers
  const headers = Array.from(
    new Set(rows.flatMap(row => Object.keys(row)))
  );
  
  // Create CSV header row
  let csv = headers.join(',') + '\n';
  
  // Add data rows
  for (const row of rows) {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if needed
      return typeof value === 'string' && (value.includes(',') || value.includes('"'))
        ? `"${value.replace(/"/g, '""')}"`
        : value;
    });
    
    csv += values.join(',') + '\n';
  }
  
  return csv;
}

// Register backup processor
export function registerBackupProcessor() {
  const { registerProcessor } = require('../queue');
  
  registerProcessor('backup', async (job: { payload: { backupId: string; options: BackupOptions } }) => {
    const { backupId, options } = job.payload;
    return await processBackup(backupId, options);
  });
}
