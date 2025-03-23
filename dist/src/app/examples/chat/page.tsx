import { ChatContainer } from '@/features/chat'

export default function ChatExamplePage() {
  return (
    <div className="container mx-auto p-4 h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">Exemplo de Chat</h1>
      <div className="h-full">
        <ChatContainer userId="user-123" metadata={{ source: 'example-page' }} />
      </div>
    </div>
  )
} 