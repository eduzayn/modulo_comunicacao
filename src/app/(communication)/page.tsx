import { ChatMessage } from '@/components/chat/chat-message'
import { Message } from 'ai'

export default function CommunicationPage() {
  const exampleMessages: Message[] = [
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Olá! Eu sou a Prof. Ana, sua assistente virtual. Como posso ajudar?'
    },
    {
      id: '2',
      role: 'user' as const,
      content: 'Oi! Gostaria de saber mais sobre os cursos disponíveis.'
    },
    {
      id: '3',
      role: 'assistant' as const,
      content: 'Claro! Temos diversos cursos nas áreas de tecnologia, negócios e idiomas. Cada curso é personalizado de acordo com o seu nível e objetivos. Você pode ouvir esta mensagem clicando no botão de play ao lado.'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-8">Chat com Prof. Ana</h1>
      <div className="space-y-8">
        {exampleMessages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </div>
  )
}
