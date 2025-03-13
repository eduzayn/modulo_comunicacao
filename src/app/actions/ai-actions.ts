'use server';

import { revalidatePath } from 'next/cache';
import { getAISettings, updateAISettings } from '../../services/supabase/ai-settings';
import type { UpdateAISettingsInput } from '../../types/ai';

export async function fetchAISettings() {
  try {
    return { data: await getAISettings(), error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function editAISettings(data: UpdateAISettingsInput) {
  try {
    const settings = await updateAISettings(data);
    revalidatePath('/ai');
    return { data: settings, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
