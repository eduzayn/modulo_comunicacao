import { NextRequest, NextResponse } from 'next/server'
import { lytexGateway } from '@/lib/lytex-gateway'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Essa função é um webhook que recebe notificações do gateway de pagamento Lytex
// sobre atualizações no status das transações
export async function POST(req: NextRequest) {
  try {
    // Verificar cabeçalho de assinatura (em uma implementação real)
    // const signature = req.headers.get('x-lytex-signature')
    // if (!signature) {
    //   return NextResponse.json({ error: 'Assinatura não fornecida' }, { status: 401 })
    // }

    // Obter o corpo da requisição
    const payload = await req.json()
    
    // Verificar se o webhook contém os campos necessários
    if (!payload.transaction_id || !payload.event_type) {
      return NextResponse.json(
        { error: 'Payload inválido' },
        { status: 400 }
      )
    }

    // Logar a recepção do webhook (para debug)
    console.log('Webhook recebido do Lytex:', {
      event: payload.event_type,
      transactionId: payload.transaction_id,
      status: payload.status
    })

    // Processar o webhook
    await lytexGateway.handleWebhook(payload)

    // Responder com sucesso
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao processar webhook do Lytex:', error)
    return NextResponse.json(
      { error: 'Erro interno ao processar webhook' },
      { status: 500 }
    )
  }
}

// Endpoint de verificação - geralmente usado pelo provedor para testar se o webhook está ativo
export async function GET() {
  return NextResponse.json({ status: 'webhook endpoint ativo' })
} 