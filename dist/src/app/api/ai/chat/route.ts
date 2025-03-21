import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages, context, metadata } = await req.json()

    // Preparamos o sistema prompt baseado no contexto e metadados
    const systemPrompt = `Você é um assistente virtual especializado em educação.
${context ? `\nContexto específico: ${context}` : ''}
${metadata?.topic ? `\nTópico: ${metadata.topic}` : ''}
${metadata?.course ? `\nCurso: ${metadata.course}` : ''}
${metadata?.student ? `\nAluno: ${metadata.student}` : ''}
${metadata?.lead ? `\nLead: ${metadata.lead}` : ''}`

    const result = await streamText({
      model: openai('gpt-4-turbo-preview'),
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages
      ],
      temperature: 0.7,
      maxTokens: 500
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Erro ao processar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
} 