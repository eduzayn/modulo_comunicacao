/**
 * Mock test script for backup functionality
 * This script simulates backup operations without requiring a live Supabase connection
 * Run with: node src/scripts/mock-backup-test.js
 */

// Mock data and functions
const mockBackups = [
  {
    id: 'mock-backup-1',
    status: 'completed',
    file_name: 'backup_mock-backup-1.json.gz',
    file_size: 12345,
    created_at: new Date().toISOString(),
    options: {
      includeMessages: true,
      includeAttachments: false,
      format: 'json',
      compressionLevel: 5
    }
  },
  {
    id: 'mock-backup-2',
    status: 'pending',
    created_at: new Date().toISOString(),
    options: {
      includeMessages: true,
      includeAttachments: true,
      format: 'csv',
      compressionLevel: 7
    }
  }
];

const mockSchedules = [
  {
    id: 'mock-schedule-1',
    schedule: 'daily',
    is_active: true,
    last_run_at: new Date(Date.now() - 86400000).toISOString(),
    next_run_at: new Date(Date.now() + 86400000).toISOString(),
    options: {
      includeMessages: true,
      includeAttachments: false,
      format: 'json',
      compressionLevel: 5
    }
  },
  {
    id: 'mock-schedule-2',
    schedule: 'weekly',
    is_active: false,
    last_run_at: null,
    next_run_at: new Date(Date.now() + 604800000).toISOString(),
    options: {
      includeMessages: true,
      includeAttachments: true,
      format: 'csv',
      compressionLevel: 7
    }
  }
];

// Mock backup creation
function mockCreateBackup(options) {
  console.log('Creating backup with options:', options);
  
  const backupId = `mock-backup-${Date.now()}`;
  const backup = {
    id: backupId,
    status: 'pending',
    file_name: `backup_${backupId}.${options.format === 'csv' ? 'csv.gz' : 'json.gz'}`,
    file_size: 0,
    created_at: new Date().toISOString(),
    options
  };
  
  mockBackups.push(backup);
  
  // Simulate async processing
  setTimeout(() => {
    const index = mockBackups.findIndex(b => b.id === backupId);
    if (index !== -1) {
      mockBackups[index].status = 'completed';
      mockBackups[index].file_size = Math.floor(Math.random() * 1000000) + 1000;
      console.log(`Backup ${backupId} completed with size ${mockBackups[index].file_size} bytes`);
    }
  }, 2000);
  
  return backup;
}

// Mock schedule creation
function mockCreateSchedule(schedule, options, isActive) {
  console.log('Creating schedule:', { schedule, options, isActive });
  
  const scheduleId = `mock-schedule-${Date.now()}`;
  const nextRun = new Date();
  
  switch (schedule) {
    case 'daily':
      nextRun.setDate(nextRun.getDate() + 1);
      break;
    case 'weekly':
      nextRun.setDate(nextRun.getDate() + 7);
      break;
    case 'monthly':
      nextRun.setMonth(nextRun.getMonth() + 1);
      break;
  }
  
  const newSchedule = {
    id: scheduleId,
    schedule,
    is_active: isActive,
    last_run_at: null,
    next_run_at: nextRun.toISOString(),
    options
  };
  
  mockSchedules.push(newSchedule);
  return newSchedule;
}

// Mock backup processing
function mockProcessBackup(backupId) {
  console.log(`Processing backup ${backupId}...`);
  
  const backup = mockBackups.find(b => b.id === backupId);
  if (!backup) {
    console.error(`Backup ${backupId} not found`);
    return false;
  }
  
  backup.status = 'processing';
  
  // Simulate processing time
  setTimeout(() => {
    backup.status = 'completed';
    backup.file_size = Math.floor(Math.random() * 1000000) + 1000;
    console.log(`Backup ${backupId} completed with size ${backup.file_size} bytes`);
  }, 1500);
  
  return true;
}

// Mock schedule processing
function mockProcessSchedules() {
  console.log('Processing schedules...');
  
  const now = new Date();
  let schedulesProcessed = 0;
  
  mockSchedules.forEach(schedule => {
    if (!schedule.is_active) return;
    
    const nextRun = new Date(schedule.next_run_at);
    if (nextRun <= now) {
      console.log(`Schedule ${schedule.id} is due, creating backup...`);
      
      // Create backup
      const backup = mockCreateBackup(schedule.options);
      
      // Update schedule
      schedule.last_run_at = now.toISOString();
      
      // Calculate next run
      const newNextRun = new Date();
      switch (schedule.schedule) {
        case 'daily':
          newNextRun.setDate(newNextRun.getDate() + 1);
          break;
        case 'weekly':
          newNextRun.setDate(newNextRun.getDate() + 7);
          break;
        case 'monthly':
          newNextRun.setMonth(newNextRun.getMonth() + 1);
          break;
      }
      
      schedule.next_run_at = newNextRun.toISOString();
      schedulesProcessed++;
    }
  });
  
  console.log(`Processed ${schedulesProcessed} schedules`);
  return schedulesProcessed;
}

// Run tests
async function runTests() {
  console.log('🧪 Starting mock backup tests...');
  
  try {
    // Test 1: Create a backup
    console.log('\n📋 Test 1: Creating backup...');
    const backup = mockCreateBackup({
      includeMessages: true,
      includeAttachments: false,
      format: 'json',
      compressionLevel: 5
    });
    console.log('✅ Backup created:', backup);
    
    // Test 2: List backups
    console.log('\n📋 Test 2: Listing backups...');
    console.log('✅ Backups:', mockBackups);
    
    // Test 3: Create a schedule
    console.log('\n📋 Test 3: Creating schedule...');
    const schedule = mockCreateSchedule('daily', {
      includeMessages: true,
      includeAttachments: false,
      format: 'json',
      compressionLevel: 5
    }, true);
    console.log('✅ Schedule created:', schedule);
    
    // Test 4: List schedules
    console.log('\n📋 Test 4: Listing schedules...');
    console.log('✅ Schedules:', mockSchedules);
    
    // Test 5: Process a backup
    console.log('\n📋 Test 5: Processing backup...');
    const processResult = mockProcessBackup(backup.id);
    console.log('✅ Process result:', processResult);
    
    // Test 6: Process schedules
    console.log('\n📋 Test 6: Processing schedules...');
    const schedulesProcessed = mockProcessSchedules();
    console.log('✅ Schedules processed:', schedulesProcessed);
    
    // Wait for async operations to complete
    console.log('\n⏳ Waiting for async operations to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Final state
    console.log('\n📊 Final state:');
    console.log('Backups:', mockBackups);
    console.log('Schedules:', mockSchedules);
    
    console.log('\n🎉 All mock backup tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
runTests();
