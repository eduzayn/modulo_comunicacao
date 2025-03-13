'use server';

import { revalidatePath } from 'next/cache';
import { getAISettings, updateAISettings } from '../../services/supabase/ai-settings';
import type { UpdateAISettingsInput } from '../../types/ai';

export async function fetchAISettings() {
  try {
    return { data: await getAISettings(), error: null };
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { data: null, error: err.message };
  }
}

export async function updateAISettingsAction(data: UpdateAISettingsInput) {
  try {
    const settings = await updateAISettings(data);
    revalidatePath('/ai');
    return { data: settings, error: null };
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { data: null, error: err.message };
  }
}
