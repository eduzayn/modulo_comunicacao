import { NextResponse } from 'next/server';
import { getAISettings, updateAISettings } from '@/app/actions/ai-actions';
import type { AISettings } from '@/src/modules/communication/types';
import type { UpdateAISettingsInput } from '@/src/modules/communication/types/ai';

export async function GET() {
  try {
    const settings = await getAISettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error in AI settings GET route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data: UpdateAISettingsInput = await request.json();
    const result = await updateAISettings(data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in AI settings PUT route:', error);
    return NextResponse.json(
      { error: 'Failed to update AI settings' },
      { status: 500 }
    );
  }
}
