import { NextResponse } from 'next/server';
import { getChannel, updateChannel } from '@/app/actions/channel-actions';
import type { Channel } from '@/src/modules/communication/types';
import type { UpdateChannelInput } from '@/src/modules/communication/types/channels';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const channel = await getChannel(params.id);
    if (!channel) {
      return NextResponse.json(
        { error: 'Canal não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(channel);
  } catch (error) {
    console.error('Error in channel GET route:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar canal' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data: UpdateChannelInput = await request.json();
    const result = await updateChannel(params.id, data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in channel PUT route:', error);
    return NextResponse.json(
      { error: 'Falha ao atualizar canal' },
      { status: 500 }
    );
  }
}
