import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';
import withMetrics from '../../../../../lib/with-metrics';

/**
 * POST /api/communication/backups/init
 * Initialize backup system (create tables and storage bucket if needed)
 */
async function handleInitBackupSystem(request: NextRequest) {
  try {
    // Check if backups table exists
    const { error: checkError } = await supabase
      .from('backups')
      .select('id', { count: 'exact', head: true });
    
    let tablesCreated = false;
    
    // If table doesn't exist, create it
    if (checkError && checkError.code === 'PGRST116') {
      // Create backups table
      const { error: createError } = await supabase.rpc('create_backup_tables');
      
      if (createError) {
        return NextResponse.json({
          success: false,
          error: createError.message,
          hint: 'Failed to create backup tables. You may need to run the SQL migration manually.',
        }, { status: 500 });
      }
      
      tablesCreated = true;
    }
    
    // Check if storage bucket exists
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
    
    let bucketCreated = false;
    
    // Create bucket if it doesn't exist
    if (!buckets?.some(bucket => bucket.name === 'backups')) {
      const { error: bucketError } = await supabase
        .storage
        .createBucket('backups', {
          public: false,
          fileSizeLimit: 104857600, // 100MB
        });
      
      if (bucketError) {
        return NextResponse.json({
          success: false,
          error: bucketError.message,
          hint: 'Failed to create backup storage bucket. You may need to create it manually.',
        }, { status: 500 });
      }
      
      bucketCreated = true;
    }
    
    return NextResponse.json({
      success: true,
      tablesCreated,
      bucketCreated,
      message: 'Backup system initialized successfully',
    });
  } catch (error) {
    console.error('Error initializing backup system:', error);
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

export const POST = withMetrics(handleInitBackupSystem);
