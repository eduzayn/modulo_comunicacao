#!/usr/bin/env node

/**
 * CLI Test Script for Email Functionality
 * 
 * This script tests the email functionality by sending a test email
 * using the configured SMTP settings in Supabase.
 * 
 * Usage:
 *   node src/scripts/test-email-cli.js [recipient_email]
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase URL or service role key');
  console.error('Make sure you have the following environment variables set:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Parse command line arguments
const args = process.argv.slice(2);
const recipientEmail = args[0] || 'test@example.com';

async function testEmailConnection() {
  console.log('🧪 Testing email connection...');
  
  try {
    // Get email configuration
    console.log('📋 Fetching email configuration...');
    const { data: config, error: configError } = await supabase
      .from('email_config')
      .select('*')
      .eq('is_default', true)
      .single();
    
    if (configError) {
      console.error('❌ Error fetching email configuration:', configError.message);
      return false;
    }
    
    if (!config) {
      console.error('❌ No default email configuration found');
      console.error('Please set up an email configuration first');
      return false;
    }
    
    console.log('✅ Using SMTP configuration:');
    console.log(`   Host: ${config.smtp_host}`);
    console.log(`   Port: ${config.smtp_port}`);
    console.log(`   User: ${config.smtp_user}`);
    console.log(`   From: ${config.from_email}`);
    
    // Call the send_email function in Supabase
    console.log(`\n📧 Sending test email to ${recipientEmail}...`);
    const { data, error } = await supabase.rpc('send_email', {
      to_email: recipientEmail,
      subject: 'Test Email from Edunéxia Communication Module',
      body_html: `
        <html>
          <body>
            <h1>Test Email</h1>
            <p>This is a test email from the Edunéxia Communication Module.</p>
            <p>If you received this email, the SMTP configuration is working correctly.</p>
            <p>Configuration details:</p>
            <ul>
              <li>SMTP Host: ${config.smtp_host}</li>
              <li>SMTP Port: ${config.smtp_port}</li>
              <li>From Email: ${config.from_email}</li>
            </ul>
            <p>Time sent: ${new Date().toISOString()}</p>
          </body>
        </html>
      `,
      body_text: `
        Test Email
        
        This is a test email from the Edunéxia Communication Module.
        If you received this email, the SMTP configuration is working correctly.
        
        Configuration details:
        - SMTP Host: ${config.smtp_host}
        - SMTP Port: ${config.smtp_port}
        - From Email: ${config.from_email}
        
        Time sent: ${new Date().toISOString()}
      `
    });
    
    if (error) {
      console.error('❌ Error sending test email:', error.message);
      return false;
    }
    
    console.log(`✅ Test email sent successfully to ${recipientEmail}`);
    console.log(`   Email log ID: ${data}`);
    
    // Check email log status
    console.log('\n📋 Checking email log status...');
    const { data: log, error: logError } = await supabase
      .from('email_logs')
      .select('*')
      .eq('id', data)
      .single();
    
    if (logError) {
      console.error('❌ Error fetching email log:', logError.message);
      return false;
    }
    
    console.log(`   Email status: ${log.status}`);
    
    if (log.status === 'sent') {
      console.log('🎉 Email test successful!');
      return true;
    } else if (log.status === 'failed') {
      console.error('❌ Email sending failed:', log.error_message);
      return false;
    } else {
      console.log('⏳ Email is still pending. Check logs for final status.');
      return true;
    }
  } catch (error) {
    console.error('❌ Unexpected error during email test:', error);
    return false;
  }
}

// Run the test
testEmailConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Email test completed successfully');
      process.exit(0);
    } else {
      console.error('\n❌ Email test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Error running email test:', error);
    process.exit(1);
  });
