import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Erro ao processar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
} 