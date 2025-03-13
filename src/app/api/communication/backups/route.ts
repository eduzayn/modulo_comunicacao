import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createBackup, listBackups, BackupOptions } from '../../../../services/backup';
import { supabase } from '../../../../lib/supabase';
import withMetrics from '../../../../lib/with-metrics';

// Schema for backup request validation
const backupRequestSchema = z.object({
  includeMessages: z.boolean().optional().default(true),
  includeAttachments: z.boolean().optional().default(false),
  conversationIds: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  format: z.enum(['json', 'csv']).optional().default('json'),
  compressionLevel: z.number().min(1).max(9).optional().default(5),
});

/**
 * GET /api/communication/backups
 * List all backups with pagination
 */
async function handleGetBackups(// request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const backups = await listBackups(limit, offset);
    
    return NextResponse.json(backups);
  } catch (error) {
    console.error('Error fetching backups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backups' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/communication/backups
 * Create a new backup
 */
async function handleCreateBackup(// request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = backupRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid backup request', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const options: BackupOptions = validationResult.data;
    
    // Create backup
    const backup = await createBackup(options);
    
    return NextResponse.json(backup);
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/communication/backups?id=123
 * Delete a backup by ID
 */
async function handleDeleteBackup(// request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Backup ID is required' },
        { status: 400 }
      );
    }
    
    // Delete from storage first
    const { data: backup } = await supabase
      .from('backups')
      .select('file_name')
      .eq('id', id)
      .single();
    
    if (backup?.file_name) {
      await supabase
        .storage
        .from('backups')
        .remove([`${id}/${backup.file_name}`]);
    }
    
    // Then delete from database
    const { error } = await supabase
      .from('backups')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting backup:', error);
      return NextResponse.json(
        { error: 'Failed to delete backup' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting backup:', error);
    return NextResponse.json(
      { error: 'Failed to delete backup' },
      { status: 500 }
    );
  }
}

export const GET = withMetrics(handleGetBackups);
export const POST = withMetrics(handleCreateBackup);
export const DELETE = withMetrics(handleDeleteBackup);
