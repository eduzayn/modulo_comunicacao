// @ts-nocheck
// @ts-nocheck



import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

dotenv.config();
// @ts-nocheck
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';


/**
 * Backup Files Storage Bucket Creation Script
 * 
 * This script creates the backup_files storage bucket with a smaller size limit
 * to avoid the "exceeded maximum allowed size" error.
 * 
 * Usage:
 *   node src/scripts/create-backup-bucket.js
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase URL or service role key in .env file');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Backup files bucket with reduced size limit
const backupBucket = {
  id: 'backup_files',
  name: 'backup_files',
  public: false,
  fileSizeLimit: 52428800, // 50MB (reduced from 100MB)
  allowedMimeTypes: [
    'application/zip',
    'application/x-gzip',
    'application/json',
    'text/plain'
  ]
};

/**
 * Create the backup_files bucket
 */
async function createBackupBucket() {
  try {
    console.log(`🚀 Creating backup_files bucket with 50MB size limit...`);
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(backupBucket.id, {
      public: backupBucket.public,
      fileSizeLimit: backupBucket.fileSizeLimit,
      allowedMimeTypes: backupBucket.allowedMimeTypes
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`ℹ️ Bucket backup_files already exists`);
        return true;
      } else {
        console.error(`❌ Error creating bucket backup_files:`, error.message);
        
        // Try with even smaller size limit if the error is about size
        if (error.message.includes('exceeded the maximum allowed size')) {
          return createBackupBucketWithSmallerSize();
        }
        
        return false;
      }
    }
    
    console.log(`✅ Bucket backup_files created successfully with 50MB limit`);
    return true;
  } catch (error) {
    console.error(`❌ Unexpected error:`, error.message);
    return false;
  }
}

/**
 * Create the backup_files bucket with an even smaller size limit
 */
async function createBackupBucketWithSmallerSize() {
  try {
    console.log(`🔄 Trying with 25MB size limit...`);
    
    // Create the bucket with smaller size limit
    const { data, error } = await supabase.storage.createBucket(backupBucket.id, {
      public: backupBucket.public,
      fileSizeLimit: 26214400, // 25MB
      allowedMimeTypes: backupBucket.allowedMimeTypes
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`ℹ️ Bucket backup_files already exists`);
        return true;
      } else {
        console.error(`❌ Error creating bucket backup_files with 25MB limit:`, error.message);
        return false;
      }
    }
    
    console.log(`✅ Bucket backup_files created successfully with 25MB limit`);
    return true;
  } catch (error) {
    console.error(`❌ Unexpected error:`, error.message);
    return false;
  }
}

/**
 * Verify the backup_files bucket
 */
async function verifyBackupBucket() {
  console.log('\n🔍 Verifying backup_files bucket...');
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('❌ Error listing buckets:', error.message);
    return false;
  }
  
  const existingBuckets = buckets.map(b => b.name);
  
  if (existingBuckets.includes('backup_files')) {
    console.log('✅ Bucket backup_files exists');
    return true;
  } else {
    console.log('❌ Bucket backup_files is still missing');
    return false;
  }
}

// Run the bucket creation and verification
async function main() {
  const created = await createBackupBucket();
  
  if (created) {
    const verified = await verifyBackupBucket();
    
    if (verified) {
      console.log('\n🎉 Backup files bucket created and verified successfully!');
    } else {
      console.log('\n⚠️ Backup files bucket creation reported success but verification failed.');
    }
  } else {
    console.log('\n❌ Failed to create backup_files bucket.');
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
