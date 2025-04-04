#!/usr/bin/env node

/**
 * Complete Database Verification Script
 * 
 * This script performs a comprehensive verification of the Supabase database structure
 * including tables, storage buckets, and other components required for the communication module.
 * 
 * Usage:
 *   node src/scripts/verify-database-complete.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase URL or service role key in .env file');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Required tables for the communication module
const requiredTables = [
  'channels',
  'conversations',
  'messages',
  'templates',
  'ai_settings',
  'webhooks',
  'queue_jobs',
  'backups',
  'email_templates',
  'email_logs',
  'metrics'
];

// Required storage buckets for the communication module
const requiredBuckets = [
  'message_attachments',
  'template_attachments',
  'channel_assets',
  'backup_files'
];

/**
 * Verify database tables
 */
async function verifyTables() {
  console.log('🔍 Verifying database tables...');
  
  const tableResults = {};
  
  for (const tableName of requiredTables) {
    try {
      const { data, error } = await supabase.from(tableName).select('count');
      
      if (error) {
        console.log(`❌ Table ${tableName}: Missing or error - ${error.message}`);
        tableResults[tableName] = { exists: false, error: error.message };
      } else {
        const count = data && data[0] ? data[0].count : 0;
        console.log(`✅ Table ${tableName}: Exists with ${count} records`);
        tableResults[tableName] = { exists: true, count };
      }
    } catch (error) {
      console.log(`❌ Table ${tableName}: Error checking - ${error.message}`);
      tableResults[tableName] = { exists: false, error: error.message };
    }
  }
  
  return tableResults;
}

/**
 * Verify storage buckets
 */
async function verifyBuckets() {
  console.log('\n🔍 Verifying storage buckets...');
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Error listing buckets:', error.message);
      return { error: error.message };
    }
    
    const existingBuckets = buckets.map(b => b.name);
    const bucketResults = {};
    
    console.log(`📋 Found ${existingBuckets.length} total buckets`);
    
    for (const bucketName of requiredBuckets) {
      if (existingBuckets.includes(bucketName)) {
        console.log(`✅ Bucket ${bucketName}: Exists`);
        bucketResults[bucketName] = { exists: true };
      } else {
        console.log(`❌ Bucket ${bucketName}: Missing`);
        bucketResults[bucketName] = { exists: false };
      }
    }
    
    return { buckets: bucketResults, allBuckets: existingBuckets };
  } catch (error) {
    console.error('❌ Error verifying buckets:', error.message);
    return { error: error.message };
  }
}

/**
 * Generate summary report
 */
function generateSummary(tableResults, bucketResults) {
  console.log('\n📊 Database Verification Summary');
  console.log('==============================');
  
  // Tables summary
  const existingTables = Object.keys(tableResults).filter(t => tableResults[t].exists);
  const missingTables = Object.keys(tableResults).filter(t => !tableResults[t].exists);
  
  console.log(`\n📋 Tables: ${existingTables.length}/${requiredTables.length} exist`);
  
  if (missingTables.length > 0) {
    console.log('❌ Missing tables:');
    missingTables.forEach(t => console.log(`  - ${t}`));
  }
  
  // Buckets summary
  if (bucketResults.error) {
    console.log('\n❌ Could not verify buckets due to error');
  } else {
    const existingBuckets = Object.keys(bucketResults.buckets).filter(b => bucketResults.buckets[b].exists);
    const missingBuckets = Object.keys(bucketResults.buckets).filter(b => !bucketResults.buckets[b].exists);
    
    console.log(`\n📋 Storage Buckets: ${existingBuckets.length}/${requiredBuckets.length} exist`);
    
    if (missingBuckets.length > 0) {
      console.log('❌ Missing buckets:');
      missingBuckets.forEach(b => console.log(`  - ${b}`));
    }
  }
  
  // Overall status
  const allTablesExist = Object.keys(tableResults).every(t => tableResults[t].exists);
  const allBucketsExist = !bucketResults.error && 
    Object.keys(bucketResults.buckets).every(b => bucketResults.buckets[b].exists);
  
  console.log('\n🏁 Overall Status:');
  
  if (allTablesExist && allBucketsExist) {
    console.log('✅ All required database components exist!');
    return true;
  } else {
    console.log('⚠️ Some required database components are missing.');
    return false;
  }
}

/**
 * Main verification function
 */
async function verifyDatabase() {
  console.log('🚀 Starting comprehensive database verification...');
  console.log(`Using Supabase URL: ${supabaseUrl}`);
  
  try {
    // Verify tables
    const tableResults = await verifyTables();
    
    // Verify buckets
    const bucketResults = await verifyBuckets();
    
    // Generate summary
    const allComponentsExist = generateSummary(tableResults, bucketResults);
    
    // Return detailed results
    return {
      success: true,
      allComponentsExist,
      tables: tableResults,
      buckets: bucketResults
    };
  } catch (error) {
    console.error('❌ Unexpected error during verification:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the verification
verifyDatabase()
  .then(results => {
    if (results.success && results.allComponentsExist) {
      console.log('\n🎉 Database verification completed successfully!');
      process.exit(0);
    } else if (results.success) {
      console.log('\n⚠️ Database verification completed with warnings.');
      process.exit(1);
    } else {
      console.log('\n❌ Database verification failed.');
      process.exit(2);
    }
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(3);
  });
