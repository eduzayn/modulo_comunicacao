'use server';

import { revalidatePath } from 'next/cache';
import { getAISettings, updateAISettings as updateAISettingsService } from '../../services/supabase/ai-settings';
import type { UpdateAISettingsInput } from '../../types/ai';

/**
 * Fetch AI settings from the database
 * @returns AI settings object or error
 */
export async function fetchAISettings() {
  try {
    return { data: await getAISettings(), error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Update AI settings in the database
 * @param data - AI settings data to update
 * @returns Updated AI settings or error
 */
export async function updateAISettings(data: UpdateAISettingsInput) {
  try {
    const settings = await updateAISettingsService(data);
    revalidatePath('/ai');
    revalidatePath('/ai/settings');
    return { data: settings, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}
