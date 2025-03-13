import { NextResponse } from 'next/server';
// import { AISettings } from '../../../../../services/supabase/ai-settings';
import type { AISettings } from '../../../../../types';
import type { UpdateAISettingsInput } from '../../../../../types/ai';
import { z } from 'zod';

const updateAISettingsSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  maxTokens: z.number().positive().optional(),
  responseType: z.enum(['concise', 'balanced', 'detailed']).optional(),
  enableSentimentAnalysis: z.boolean().optional(),
  enableAutoResponses: z.boolean().optional(),
  enableMessageClassification: z.boolean().optional(),
  enableResponseSuggestions: z.boolean().optional(),
  knowledgeBaseId: z.string().optional().nullable()
});

export async function GET() {
  try {
    const settings = await getAISettings();
    return NextResponse.json(settings);
  } catch (error: unknown) {
    console.error('Error in AI settings GET route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch AI settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = updateAISettingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid AI settings data', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    // Transform the data to match the database schema
    const settingsData: unknown = {};
    if (result.data.model !== undefined) settingsData.model = result.data.model;
    if (result.data.temperature !== undefined) settingsData.temperature = result.data.temperature;
    if (result.data.maxTokens !== undefined) settingsData.max_tokens = result.data.maxTokens;
    if (result.data.responseType !== undefined) settingsData.response_type = result.data.responseType;
    if (result.data.enableSentimentAnalysis !== undefined) settingsData.enable_sentiment_analysis = result.data.enableSentimentAnalysis;
    if (result.data.enableAutoResponses !== undefined) settingsData.enable_auto_responses = result.data.enableAutoResponses;
    if (result.data.enableMessageClassification !== undefined) settingsData.enable_message_classification = result.data.enableMessageClassification;
    if (result.data.enableResponseSuggestions !== undefined) settingsData.enable_response_suggestions = result.data.enableResponseSuggestions;
    if (result.data.knowledgeBaseId !== undefined) settingsData.knowledge_base_id = result.data.knowledgeBaseId;
    
    const settings = await updateAISettings(settingsData);
    return NextResponse.json(settings);
  } catch (error: unknown) {
    console.error('Error in AI settings PUT route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update AI settings' },
      { status: 500 }
    );
  }
}
