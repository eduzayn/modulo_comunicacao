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
 * Create Missing Tables Script
 * 
 * This script creates the missing tables required for the communication module
 * using the Supabase JavaScript client and the exec_sql function.
 * 
 * Usage:
 *   node src/scripts/create-missing-tables.js
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

// SQL statements to create missing tables
const sqlStatements = {
  // Webhooks table
  webhooks: `
    CREATE TABLE IF NOT EXISTS public.webhooks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      events TEXT[] NOT NULL,
      headers JSONB DEFAULT '{}'::jsonb,
      is_active BOOLEAN DEFAULT true,
      secret_key TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    COMMENT ON TABLE public.webhooks IS 'Webhooks for external integrations';
  `,
  
  // Queue jobs table
  queue_jobs: `
    CREATE TABLE IF NOT EXISTS public.queue_jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      queue_name TEXT NOT NULL,
      payload JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER DEFAULT 0,
      max_attempts INTEGER DEFAULT 3,
      result JSONB,
      error TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT now(),
      started_at TIMESTAMP WITH TIME ZONE,
      completed_at TIMESTAMP WITH TIME ZONE
    );
    
    CREATE INDEX IF NOT EXISTS queue_jobs_status_idx ON public.queue_jobs (status);
    CREATE INDEX IF NOT EXISTS queue_jobs_queue_name_idx ON public.queue_jobs (queue_name);
    
    COMMENT ON TABLE public.queue_jobs IS 'Asynchronous job queue for background processing';
  `,
  
  // Backups table
  backups: `
    CREATE TABLE IF NOT EXISTS public.backups (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      file_path TEXT,
      file_size BIGINT,
      backup_type TEXT NOT NULL,
      tables TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      completed_at TIMESTAMP WITH TIME ZONE,
      metadata JSONB DEFAULT '{}'::jsonb
    );
    
    CREATE INDEX IF NOT EXISTS backups_status_idx ON public.backups (status);
    CREATE INDEX IF NOT EXISTS backups_created_at_idx ON public.backups (created_at);
    
    COMMENT ON TABLE public.backups IS 'Backup records for the communication module';
  `,
  
  // Email templates table
  email_templates: `
    CREATE TABLE IF NOT EXISTS public.email_templates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      variables JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    COMMENT ON TABLE public.email_templates IS 'Email templates for the communication module';
  `,
  
  // Email logs table
  email_logs: `
    CREATE TABLE IF NOT EXISTS public.email_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      template_id UUID REFERENCES public.email_templates(id),
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL,
      error TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      sent_at TIMESTAMP WITH TIME ZONE
    );
    
    CREATE INDEX IF NOT EXISTS email_logs_status_idx ON public.email_logs (status);
    CREATE INDEX IF NOT EXISTS email_logs_created_at_idx ON public.email_logs (created_at);
    
    COMMENT ON TABLE public.email_logs IS 'Email sending logs for the communication module';
  `,
  
  // Metrics table
  metrics: `
    CREATE TABLE IF NOT EXISTS public.metrics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      metric_name TEXT NOT NULL,
      metric_value NUMERIC NOT NULL,
      dimensions JSONB DEFAULT '{}'::jsonb,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    CREATE INDEX IF NOT EXISTS metrics_name_idx ON public.metrics (metric_name);
    CREATE INDEX IF NOT EXISTS metrics_timestamp_idx ON public.metrics (timestamp);
    
    COMMENT ON TABLE public.metrics IS 'Performance and usage metrics for the communication module';
  `
};

/**
 * Execute SQL using the exec_sql function
 * @param {string} sql SQL statement to execute
 * @param {string} description Description of the SQL operation
 * @returns {Promise<boolean>} True if the SQL was executed successfully
 */
async function executeSql(sql, description) {
  try {
    console.log(`⏳ ${description}...`);
    
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return false;
    }
    
    if (data && !data.success) {
      console.error(`❌ Error: ${data.error || 'Unknown error'}`);
      return false;
    }
    
    console.log(`✅ Success: ${description}`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

/**
 * Check if a table exists
 * @param {string} tableName Table name to check
 * @returns {Promise<boolean>} True if the table exists
 */
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select('count');
    
    if (error && error.message.includes('does not exist')) {
      return false;
    }
    
    return !error;
  } catch (error) {
    return false;
  }
}

/**
 * Create all missing tables
 */
async function createMissingTables() {
  console.log('🚀 Creating missing tables...');
  
  const results = [];
  
  for (const [tableName, sql] of Object.entries(sqlStatements)) {
    // Check if table already exists
    const exists = await tableExists(tableName);
    
    if (exists) {
      console.log(`ℹ️ Table ${tableName} already exists, skipping`);
      results.push({ table: tableName, success: true, skipped: true });
      continue;
    }
    
    // Create the table
    const success = await executeSql(sql, `Creating ${tableName} table`);
    results.push({ table: tableName, success, skipped: false });
  }
  
  // Print summary
  console.log('\n📊 Table Creation Summary');
  console.log('=======================');
  
  for (const result of results) {
    if (result.skipped) {
      console.log(`ℹ️ ${result.table}: Already exists`);
    } else if (result.success) {
      console.log(`✅ ${result.table}: Created successfully`);
    } else {
      console.log(`❌ ${result.table}: Failed to create`);
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  const createdCount = results.filter(r => r.success && !r.skipped).length;
  const skippedCount = results.filter(r => r.skipped).length;
  
  console.log(`\n📈 Results: ${successCount}/${results.length} successful (${createdCount} created, ${skippedCount} already existed)`);
  
  return successCount === results.length;
}

// Run the table creation
createMissingTables()
  .then(success => {
    if (success) {
      console.log('\n🎉 All tables created or already exist!');
      process.exit(0);
    } else {
      console.log('\n⚠️ Some tables failed to create. Check the output above for details.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(2);
  });
