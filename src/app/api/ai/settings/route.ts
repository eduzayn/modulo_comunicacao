import { NextResponse } from 'next/server';
// // import { AISettings } from '@/app/actions/ai-actions';
import type { AISettings } from '@/types/index';
import type { UpdateAISettingsInput } from '@/types/ai';

export async function GET() {
  try {
    const result = await fetchAISettings();
    return NextResponse.json(result.data);
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
    const result = await editAISettings(data);
    
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
