# Feature: Inteligência Artificial

Esta feature implementa capacidades de IA no Módulo de Comunicação, incluindo análise de sentimento, classificação automática, respostas sugeridas e chatbots.

## Funcionalidades Implementadas

- **Análise de Sentimento**: Detecta a satisfação do cliente em mensagens, identificando sentimentos positivos, negativos ou neutros
- **Classificação de Mensagens**: Categoriza mensagens por intenção (perguntas, reclamações, feedback, etc.)
- **Extração de Entidades**: Identifica informações relevantes em mensagens (emails, telefones, datas, URLs)

## Funcionalidades Planejadas

- **Respostas Sugeridas**: Sugerir respostas com base no contexto
- **Chatbots**: Bots para atendimento inicial e coleta de informações
- **Resumo de Conversas**: Gerar resumos automáticos de conversas longas

## Integração com Outras Features

Esta feature se integra com:
- **Inbox**: Para análise de sentimento e classificação em conversas ativas
- **CRM**: Para enriquecimento de dados e insights
- **Settings**: Para configuração de modelos e comportamentos

## Tecnologias

- Hooks personalizados para análise de sentimento e classificação
- Implementação inicial simulada para desenvolvimento (mock)
- Preparado para integração futura com:
  - Vercel AI SDK
  - OpenAI API
  - Langchain
  - Edge Functions (Supabase)

## Componentes

- `SentimentAverageDisplay`: Exibe a média de sentimento de várias mensagens
- `MessageIntentTag`: Tag que mostra a intenção de uma mensagem
- `MessageSentimentIndicator`: Indicador de sentimento para mensagens individuais (na feature Inbox)

## Serviços

- `sentimentService`: Analisa o sentimento de textos
- `messageClassificationService`: Classifica mensagens e identifica entidades

## Hooks

- `useSentimentAnalysis`: Gerencia estado para análise de sentimento
- `useMessageClassification`: Gerencia estado para classificação de mensagens

## Estado Atual

Implementação inicial concluída com versões simuladas (mock) dos serviços de IA para desenvolvimento e testes. Os componentes de UI estão funcionais e integrados com a feature de Inbox.

## Próximos Passos

1. Substituir implementações simuladas por integrações reais com modelos de IA
2. Implementar componentes para respostas sugeridas
3. Desenvolver chatbot básico
4. Implementar resumo automático de conversas 