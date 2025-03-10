import { supabase } from '../../lib/supabase';
import type { AISettings } from '../../types';
import type { UpdateAISettingsInput } from '../../types/ai';

export async function getAISettings() {
  const { data, error } = await supabase
    .from('ai_settings')
    .select('*')
    .limit(1)
    .single();
  
  if (error) {
    throw new Error(`Error fetching AI settings: ${error.message}`);
  }
  
  return data as AISettings;
}

export async function updateAISettings(settings: UpdateAISettingsInput) {
  // First get the current settings to get the ID
  const { data: currentSettings, error: fetchError } = await supabase
    .from('ai_settings')
    .select('id')
    .limit(1)
    .single();
  
  if (fetchError) {
    throw new Error(`Error fetching AI settings: ${fetchError.message}`);
  }
  
  // Then update the settings
  const { data, error } = await supabase
    .from('ai_settings')
    .update(settings)
    .eq('id', currentSettings.id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating AI settings: ${error.message}`);
  }
  
  return data as AISettings;
}
