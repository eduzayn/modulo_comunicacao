# Feature: Chat

Esta feature implementa funcionalidades de chat para o projeto, permitindo conversas em tempo real entre usuários e assistentes AI.

## Estrutura

A feature segue a arquitetura orientada a features, organizada da seguinte forma:

```
src/features/chat/
├── components/         # Componentes React da feature
│   ├── ChatContainer.tsx    # Componente principal que integra todo o chat
│   ├── ChatInput.tsx        # Input para envio de mensagens
│   ├── ChatMessage.tsx      # Renderização de uma mensagem individual
│   └── ChatMessages.tsx     # Lista de mensagens
├── hooks/              # Hooks React específicos da feature
│   └── use-chat.ts     # Hook para gerenciar estado e operações do chat
├── services/           # Serviços para comunicação com backend
│   └── chat-service.ts # Serviço para gerenciar conversas e mensagens
├── types/              # Tipagens e utilitários
│   └── chat.types.ts   # Interfaces e funções utilitárias
├── index.ts            # Exportações públicas da feature
└── README.md           # Documentação
```

## Componentes

### ChatContainer

Componente principal que integra todos os componentes do chat. Gerencia o ciclo de vida da conversa, exibindo mensagens e permitindo a interação do usuário.

```tsx
<ChatContainer 
  userId="user-123" 
  metadata={{ source: 'example-page' }} 
/>
```

### ChatMessage

Componente para renderizar uma mensagem individual, com suporte para diferentes tipos de mensagens (texto, arquivos, áudio).

### ChatMessages

Componente para exibir a lista de mensagens, com rolagem automática para a última mensagem.

### ChatInput

Componente para entrada e envio de mensagens, com suporte para tecla Enter.

## Hooks

### useChat

Hook que gerencia o estado e operações do chat, incluindo:

- `startConversation`: Inicia uma nova conversa
- `sendMessage`: Envia uma mensagem
- `endConversation`: Finaliza uma conversa

```tsx
const { 
  messages, 
  conversation, 
  isLoading, 
  error,
  startConversation,
  sendMessage,
  endConversation
} = useChat();
```

## Serviços

### chat-service

Serviço que gerencia as operações de comunicação com o backend:

- `sendMessage`: Envia uma mensagem para uma conversa existente
- `createConversation`: Cria uma nova conversa
- `archiveConversation`: Arquiva uma conversa existente

## Tipos

A feature define os seguintes tipos principais:

- `Message`: Representa uma mensagem individual
- `Chat`: Representa um chat com um contato
- `Conversation`: Representa uma conversa completa
- `ChatState`: Estado global da feature

## Exemplo de Uso

```tsx
import { ChatContainer } from '@/features/chat';

export default function ChatPage() {
  return (
    <div className="h-screen">
      <ChatContainer userId="user-123" />
    </div>
  );
}
```

## Configuração Avançada

Para personalizar o comportamento do chat, você pode utilizar as funções e componentes exportados individualmente:

```tsx
import { useChat, ChatMessages, ChatInput } from '@/features/chat';

function CustomChatUI() {
  const { messages, isLoading, sendMessage } = useChat();
  
  return (
    <div className="custom-container">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
``` 