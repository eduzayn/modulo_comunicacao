import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '7d';

  // Simulação de dados - em produção, buscar do banco de dados
  const stats = {
    messages: {
      total: 1248,
      growth: 12.5
    },
    responseRate: {
      value: 94.2,
      growth: 2.1
    },
    responseTime: {
      value: 5.2,
      growth: 0.8
    },
    channels: {
      whatsapp: 45,
      email: 25,
      chat: 20,
      sms: 10
    },
    sentiment: {
      positive: 68,
      neutral: 24,
      negative: 8
    },
    activity: [65, 40, 85, 30, 55, 60, 45]
  };

  return NextResponse.json(stats);
} 