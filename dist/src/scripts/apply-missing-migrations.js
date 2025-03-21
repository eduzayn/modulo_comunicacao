#!/usr/bin/env node

/**
 * Apply Missing Database Migrations Script
 * 
 * This script applies all missing database migrations for the communication module
 * using the Supabase JavaScript client and SQL execution.
 * 
 * Usage:
 *   node src/scripts/apply-missing-migrations.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase URL or service role key in .env file');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Migration files to apply
const migrationFiles = [
  {
    name: 'Webhooks',
    path: path.join(__dirname, '../../supabase/migrations/20250311_webhooks.sql'),
    tables: ['webhooks']
  },
  {
    name: 'Queue Jobs',
    path: path.join(__dirname, '../../supabase/migrations/20250310_queue_jobs.sql'),
    tables: ['queue_jobs']
  },
  {
    name: 'Backups',
    path: path.join(__dirname, '../../supabase/migrations/20250310_backups.sql'),
    tables: ['backups']
  },
  {
    name: 'Email',
    path: path.join(__dirname, '../../supabase/migrations/20250310_email_config.sql'),
    tables: ['email_templates', 'email_logs']
  },
  {
    name: 'Metrics',
    path: path.join(__dirname, '../../supabase/migrations/20250310_metrics.sql'),
    tables: ['metrics']
  }
];

/**
 * Check if a table exists in the database
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
 * Execute SQL directly using RPC function
 * @param {string} sql SQL to execute
 * @returns {Promise<object>} Result of the SQL execution
 */
async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('❌ Error executing SQL:', error.message);
      return { success: false, error: error.message };
    }
    
    return data || { success: true };
  } catch (error) {
    console.error('❌ Error executing SQL:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Create the exec_sql function if it doesn't exist
 */
async function createExecSqlFunction() {
  console.log('🔍 Checking if exec_sql function exists...');
  
  try {
    // Try to call the function to see if it exists
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: 'SELECT 1 as test' 
    });
    
    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      console.log('⚙️ Creating exec_sql function...');
      
      // Create the function using raw SQL query
      const createFunctionSql = `
        CREATE OR REPLACE FUNCTION exec_sql(sql text)
        RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSONB;
        BEGIN
          EXECUTE sql;
          RETURN jsonb_build_object('success', true);
        EXCEPTION
          WHEN OTHERS THEN
            RETURN jsonb_build_object('success', false, 'error', SQLERRM);
        END;
        $$;
      `;
      
      // Execute the SQL directly using the REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql: createFunctionSql })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error creating exec_sql function:', errorData);
        
        // Try alternative approach using direct SQL
        console.log('🔄 Trying alternative approach to create function...');
        
        // Create a temporary table to check if we have permissions
        const { data: tempData, error: tempError } = await supabase
          .from('temp_check_permissions')
          .insert([{ id: 1 }]);
        
        if (tempError && !tempError.message.includes('does not exist')) {
          console.error('❌ Insufficient permissions to create database objects');
          return false;
        }
        
        return false;
      }
      
      console.log('✅ exec_sql function created successfully');
      return true;
    } else if (error) {
      console.error('❌ Error checking exec_sql function:', error.message);
      return false;
    } else {
      console.log('✅ exec_sql function already exists');
      return true;
    }
  } catch (error) {
    console.error('❌ Error creating exec_sql function:', error.message);
    return false;
  }
}

/**
 * Apply a migration file
 * @param {object} migration Migration file object
 * @returns {Promise<boolean>} True if the migration was applied successfully
 */
async function applyMigration(migration) {
  console.log(`\n🚀 Applying ${migration.name} migration...`);
  
  try {
    // Check if any of the tables already exist
    const existingTables = [];
    const missingTables = [];
    
    for (const tableName of migration.tables) {
      const exists = await tableExists(tableName);
      
      if (exists) {
        existingTables.push(tableName);
      } else {
        missingTables.push(tableName);
      }
    }
    
    if (existingTables.length === migration.tables.length) {
      console.log(`✅ All tables for ${migration.name} already exist`);
      return true;
    }
    
    console.log(`📋 Missing tables: ${missingTables.join(', ')}`);
    
    // Read the migration file
    const sql = fs.readFileSync(migration.path, 'utf8');
    
    // Split the SQL into statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`📄 Found ${statements.length} SQL statements in migration file`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      const result = await executeSql(statement);
      
      if (!result.success) {
        console.error(`❌ Error executing statement ${i + 1}:`, result.error);
        return false;
      }
    }
    
    console.log(`✅ ${migration.name} migration applied successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error applying ${migration.name} migration:`, error.message);
    return false;
  }
}

/**
 * Apply all missing migrations
 */
async function applyMissingMigrations() {
  console.log('🚀 Starting database migrations application...');
  
  // Create the exec_sql function if it doesn't exist
  const execSqlExists = await createExecSqlFunction();
  
  if (!execSqlExists) {
    console.error('❌ Failed to create or verify exec_sql function');
    console.log('⚠️ Will attempt to continue with migrations, but they may fail');
  }
  
  // Apply each migration
  const results = [];
  
  for (const migration of migrationFiles) {
    const success = await applyMigration(migration);
    results.push({ name: migration.name, success });
  }
  
  // Print summary
  console.log('\n📊 Migration Summary');
  console.log('=================');
  
  for (const result of results) {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}`);
  }
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n📈 Applied ${successCount}/${migrationFiles.length} migrations successfully`);
  
  return successCount === migrationFiles.length;
}

// Run the migrations
applyMissingMigrations()
  .then(success => {
    if (success) {
      console.log('\n🎉 All migrations applied successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️ Some migrations failed to apply. Check the output above for details.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(2);
  });
