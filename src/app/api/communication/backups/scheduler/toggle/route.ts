import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '../../../../../../lib/supabase';
import withMetrics from '../../../../../../lib/with-metrics';
import { recordMetric } from '../../../../../../services/metrics';

// Schema for toggle request validation
const toggleSchedulerSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
});

/**
 * POST /api/communication/backups/scheduler/toggle
 * Toggle a backup schedule on/off
 */
async function handleToggleScheduler(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = toggleSchedulerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid toggle request', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { id, isActive } = validationResult.data;
    
    // Check if schedule exists
    const { data: existingSchedule, error: checkError } = await supabase
      .from('backup_schedules')
      .select('id, schedule')
      .eq('id', id)
      .single();
    
    if (checkError || !existingSchedule) {
      return NextResponse.json(
        { error: 'Backup schedule not found' },
        { status: 404 }
      );
    }
    
    // Update schedule
    const { error: updateError } = await supabase
      .from('backup_schedules')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error updating backup schedule:', updateError);
      return NextResponse.json(
        { error: 'Failed to update backup schedule' },
        { status: 500 }
      );
    }
    
    // Record metric
    await recordMetric({
      type: 'custom',
      value: 1,
      tags: {
        metricName: 'backup_schedule_toggle',
        scheduleId: id,
        schedule: existingSchedule.schedule,
        isActive: isActive.toString(),
      },
    });
    
    return NextResponse.json({
      success: true,
      message: `Backup schedule ${isActive ? 'activated' : 'deactivated'} successfully`,
      id,
      isActive,
    });
  } catch (error) {
    console.error('Error toggling backup schedule:', error);
    return NextResponse.json(
      { error: 'Failed to toggle backup schedule' },
      { status: 500 }
    );
  }
}

export const POST = withMetrics(handleToggleScheduler);
