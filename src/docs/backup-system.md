# Backup System Documentation

## Overview

The backup system provides a robust solution for automatically backing up conversations and related data in the Edunexia Communication Module. It supports scheduled backups, manual backups, and comprehensive backup management features.

## Key Features

- **Scheduled Backups**: Configure daily, weekly, or monthly automatic backups
- **Manual Backups**: Create on-demand backups with customizable options
- **Backup Management**: View, download, and delete backups
- **Flexible Configuration**: Control what data is included in backups
- **Multiple Formats**: Support for JSON and CSV export formats
- **Compression**: Configurable compression levels to balance size and speed
- **Metrics**: Detailed performance tracking for backup operations

## Architecture

The backup system consists of several components:

1. **Backup Service**: Core functionality for creating, processing, and managing backups
2. **Scheduler**: Manages automatic backup schedules
3. **API Routes**: RESTful endpoints for interacting with the backup system
4. **UI Components**: User interface for backup management
5. **Storage Integration**: Supabase storage for backup files

## Database Schema

The backup system uses the following tables in Supabase:

### `backups` Table
- `id`: Unique identifier for the backup
- `status`: Current status (pending, processing, completed, failed)
- `file_name`: Name of the backup file
- `file_size`: Size of the backup file in bytes
- `url`: Signed URL for downloading the backup
- `expires_at`: Expiration date for the signed URL
- `options`: JSON object containing backup options
- `error`: Error message if the backup failed
- `created_at`: Timestamp when the backup was created
- `updated_at`: Timestamp when the backup was last updated

### `backup_schedules` Table
- `id`: Unique identifier for the schedule
- `schedule`: Frequency (daily, weekly, monthly)
- `options`: JSON object containing backup options
- `is_active`: Whether the schedule is active
- `last_run_at`: Timestamp when the schedule last ran
- `next_run_at`: Timestamp when the schedule will next run
- `created_at`: Timestamp when the schedule was created
- `updated_at`: Timestamp when the schedule was last updated

## API Endpoints

### Backup Management
- `GET /api/communication/backups`: List all backups
- `POST /api/communication/backups`: Create a new backup
- `GET /api/communication/backups/:id`: Get a specific backup
- `DELETE /api/communication/backups/:id`: Delete a backup

### Backup Scheduler
- `GET /api/communication/backups/scheduler/status`: Get scheduler status
- `POST /api/communication/backups/scheduler`: Create a new schedule
- `POST /api/communication/backups/scheduler/toggle`: Toggle a schedule on/off

### Backup Operations
- `POST /api/communication/backups/init`: Initialize backup system
- `GET /api/communication/backups/verify`: Verify backup system health
- `POST /api/communication/backups/cleanup`: Clean up old backups
- `GET /api/communication/backups/metrics`: Get backup metrics

## Usage Examples

### Creating a Manual Backup

```typescript
// Client-side code
const createBackup = async () => {
  const response = await fetch('/api/communication/backups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      includeMessages: true,
      includeAttachments: false,
      format: 'json',
      compressionLevel: 5,
    }),
  });
  
  const backup = await response.json();
  console.log('Backup created:', backup);
};
```

### Creating a Backup Schedule

```typescript
// Client-side code
const createSchedule = async () => {
  const response = await fetch('/api/communication/backups/scheduler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      schedule: 'daily',
      options: {
        includeMessages: true,
        includeAttachments: false,
        format: 'json',
        compressionLevel: 5,
      },
      is_active: true,
    }),
  });
  
  const schedule = await response.json();
  console.log('Schedule created:', schedule);
};
```

## Implementation Details

### Backup Processing

Backups are processed asynchronously using a queue system:

1. A backup record is created with status "pending"
2. A job is added to the queue
3. The queue processor picks up the job and processes the backup
4. The backup record is updated with the result

### Scheduler Processing

The scheduler runs periodically to check for due backups:

1. Retrieve all active schedules
2. Check if any schedules are due to run
3. Create backups for due schedules
4. Update schedules with new last_run_at and next_run_at values

### Error Handling

The backup system includes comprehensive error handling:

- Failed backups are marked with status "failed" and include an error message
- Metrics are recorded for both successful and failed backups
- The UI displays appropriate error messages to users

## Performance Considerations

- Backups are compressed to reduce storage requirements
- Large backups are processed in chunks to avoid memory issues
- Signed URLs are used for secure, temporary access to backup files
- Metrics are collected to monitor and optimize performance

## Security Considerations

- Backup files are stored in a private Supabase bucket
- Access to backups requires authentication
- Sensitive data can be excluded from backups
- Backup files are encrypted at rest in Supabase storage

## Testing

The backup system can be tested using the provided test scripts:

- `src/scripts/test-backup.js`: Tests the backup API endpoints
- `src/scripts/mock-backup-test.js`: Tests the backup functionality with mock data

## Future Improvements

- Add support for incremental backups
- Implement more advanced filtering options
- Add support for backup encryption
- Implement cross-region backup replication
- Add support for more export formats
