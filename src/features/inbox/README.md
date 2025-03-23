# Feature: Inbox

Esta feature implementa a caixa de entrada unificada do Módulo de Comunicação, permitindo gerenciar conversas de diversos canais em um único lugar.

## Funcionalidades Implementadas

- **Lista de Conversas**: Visualização e gerenciamento de todas as conversas
- **Detalhes de Conversação**: Visualização de mensagens e detalhes da conversa
- **Exibição de Sentimento**: Integração com a feature AI para mostrar o sentimento das mensagens
- **Componentes de Mensagens**: Exibição de mensagens com suporte para análise de sentimento

## Integração com Outras Features

Esta feature se integra com:
- **AI**: Para análise de sentimento e classificação automática de mensagens
- **CRM**: Para vinculação de conversas com contatos e oportunidades
- **Settings**: Para aplicação de regras e configurações
- **Tags**: Para categorização de conversas

## Componentes

- `ConversationList`: Lista as conversas disponíveis
- `MessageItem`: Exibe uma mensagem individual com suporte para indicador de sentimento
- `MessageList`: Exibe a lista de mensagens de uma conversa
- `MessageSentimentIndicator`: Componente que mostra o sentimento de uma mensagem (integrado com AI)

## Próximos Passos

1. Implementar filtros de conversa
2. Desenvolver funcionalidade de transferência de conversas
3. Adicionar suporte para respostas rápidas
4. Implementar visualização de contexto do cliente
5. Integrar com sugestões de resposta da IA 