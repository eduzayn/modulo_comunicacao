import { supabase } from '../../lib/supabase';
import type { AISettings } from '../../types';
import type { UpdateAISettingsInput } from '../../types/ai';
import type { Database } from '../../lib/database.types';

// Helper function to convert database model to application model
function mapDbToAISettings(data: Database['public']['Tables']['ai_settings']['Row']): AISettings {
  return {
    model: data.model,
    temperature: data.temperature,
    maxTokens: data.max_tokens,
    autoRespond: data.auto_respond,
    sentimentAnalysis: data.sentiment_analysis,
    suggestResponses: data.suggest_responses
  };
}

export async function getAISettings() {
  const { data, error } = await supabase
    .from('ai_settings')
    .select('*')
    .limit(1)
    .single();
  
  if (error) {
    throw new Error(`Error fetching AI settings: ${error.message}`);
  }
  
  return mapDbToAISettings(data);
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
  
  return mapDbToAISettings(data);
}
