#!/usr/bin/env node

/**
 * Supabase Storage Buckets Creation Script
 * 
 * This script creates the required storage buckets for the communication module
 * using the Supabase JavaScript client and the provided token.
 * 
 * Usage:
 *   node src/scripts/create-buckets.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseToken = 'sbp_057451a19b2fcdc89fc94ac28289e321ffc6e6a0';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseToken);

// Required storage buckets with their configurations
const requiredBuckets = [
  {
    id: 'message_attachments',
    name: 'message_attachments',
    public: false,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: [
      'image/png',
      'image/jpeg',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip'
    ]
  },
  {
    id: 'template_attachments',
    name: 'template_attachments',
    public: false,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: [
      'image/png',
      'image/jpeg',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  },
  {
    id: 'channel_assets',
    name: 'channel_assets',
    public: true,
    fileSizeLimit: 2097152, // 2MB
    allowedMimeTypes: [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml'
    ]
  },
  {
    id: 'backup_files',
    name: 'backup_files',
    public: false,
    fileSizeLimit: 104857600, // 100MB
    allowedMimeTypes: [
      'application/zip',
      'application/x-gzip',
      'application/json',
      'text/plain'
    ]
  }
];

/**
 * Create a storage bucket
 * @param {Object} bucket Bucket configuration
 */
async function createBucket(bucket) {
  try {
    console.log(`⏳ Creating bucket: ${bucket.id}...`);
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimit,
      allowedMimeTypes: bucket.allowedMimeTypes
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`ℹ️ Bucket ${bucket.id} already exists`);
        return true;
      } else {
        console.error(`❌ Error creating bucket ${bucket.id}:`, error.message);
        return false;
      }
    }
    
    console.log(`✅ Bucket ${bucket.id} created successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating bucket ${bucket.id}:`, error.message);
    return false;
  }
}

/**
 * Create all required storage buckets
 */
async function createAllBuckets() {
  console.log('🚀 Creating storage buckets...');
  
  let successCount = 0;
  
  for (const bucket of requiredBuckets) {
    const success = await createBucket(bucket);
    if (success) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Created ${successCount}/${requiredBuckets.length} buckets`);
  
  // Verify buckets
  console.log('\n🔍 Verifying storage buckets...');
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('❌ Error listing buckets:', error.message);
  } else {
    const existingBuckets = buckets.map(b => b.name);
    
    console.log('\n📋 Storage buckets status:');
    requiredBuckets.forEach(bucket => {
      if (existingBuckets.includes(bucket.id)) {
        console.log(`✅ Bucket exists: ${bucket.id}`);
      } else {
        console.log(`❌ Bucket missing: ${bucket.id}`);
      }
    });
    
    if (requiredBuckets.every(b => existingBuckets.includes(b.id))) {
      console.log('\n🎉 All storage buckets created successfully!');
    } else {
      console.log('\n⚠️ Some storage buckets are missing. Please check the output above.');
    }
  }
}

// Run the bucket creation
createAllBuckets()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
