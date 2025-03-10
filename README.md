# Módulo de Comunicação da Edunéxia

O Módulo de Comunicação é uma solução completa e integrada para gerenciar todas as interações e comunicações dentro da plataforma educacional Edunéxia. Ele combina recursos de mensageria, inteligência artificial e gestão de canais para proporcionar uma experiência de comunicação eficiente e personalizada.

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Integrado-green)
![OpenAI](https://img.shields.io/badge/OpenAI-Integrado-green)

## Estrutura Principal

### 1. Sistema de Canais (/channels)
- **Gestão de Canais de Comunicação**
  - WhatsApp Business API
  - E-mail Marketing
  - Chat Interno
  - SMS
  - Notificações Push
- **Recursos dos Canais**
  - Configuração de canais por perfil de usuário
  - Integração com APIs externas
  - Monitoramento de status
  - Métricas de entrega e engajamento

### 2. Sistema de Conversas (/conversations)
- **Gestão de Conversas**
  - Chat em tempo real
  - Histórico de conversas
  - Organização por contexto (acadêmico, administrativo, suporte)
  - Sistema de priorização
- **Recursos de Conversação**
  - Troca de mensagens em tempo real
  - Suporte a mídia (imagens, documentos, áudio)
  - Marcação de mensagens importantes
  - Filtros e busca avançada

### 3. Inteligência Artificial (/ai)
- **AI Settings**
  - Configuração de modelos de IA
  - Personalização de respostas automáticas
  - Treinamento de modelos específicos
- **Recursos de IA**
  - Análise de sentimento
  - Respostas automáticas inteligentes
  - Classificação de mensagens
  - Sugestões de resposta
  - Base de conhecimento automatizada

### 4. Templates e Automação (/templates)
- **Sistema de Templates**
  - Templates personalizáveis para diferentes tipos de comunicação
  - Variáveis dinâmicas
  - Versionamento de templates
- **Automações**
  - Fluxos de comunicação automatizados
  - Gatilhos baseados em eventos
  - Regras de distribuição de mensagens
  - Escalonamento automático

## Tecnologias Utilizadas

### Core
- Next.js 15.2.1 (App Router + RSC)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI + Radix UI

### Gerenciamento
- TanStack Query
- Zod (validação)
- Server Actions

### Banco de Dados e IA
- Supabase (PostgreSQL)
- OpenAI API (GPT-3.5 Turbo)

## Configuração do Ambiente

### Pré-requisitos
- Node.js 18+
- npm ou pnpm

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/eduzayn/modulo_comunicacao.git
cd modulo_comunicacao
```

2. Instale as dependências:
```bash
npm install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
SUPABASE_JWT_SECRET=seu_jwt_secret_do_supabase
OPENAI_API_KEY=sua_chave_api_da_openai
```

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
# ou
pnpm dev
```

## Estrutura do Banco de Dados (Supabase)

### Tabelas Principais

#### channels
- id (uuid, primary key)
- name (text)
- type (text): 'whatsapp', 'email', 'chat', 'sms', 'push'
- status (text): 'active', 'inactive'
- config (jsonb): configurações específicas do canal
- created_at (timestamp)
- updated_at (timestamp)

#### conversations
- id (uuid, primary key)
- channel_id (uuid, foreign key)
- participants (text[]): lista de IDs dos participantes
- status (text): 'open', 'closed', 'pending'
- priority (text): 'low', 'medium', 'high'
- context (text): 'academic', 'administrative', 'support'
- created_at (timestamp)
- updated_at (timestamp)

#### messages
- id (uuid, primary key)
- conversation_id (uuid, foreign key)
- sender_id (text): ID do remetente
- content (text): conteúdo da mensagem
- type (text): 'text', 'image', 'document', 'audio'
- status (text): 'sent', 'delivered', 'read'
- media_url (text): URL para mídia (opcional)
- metadata (jsonb): metadados adicionais
- created_at (timestamp)

#### templates
- id (uuid, primary key)
- name (text)
- content (text)
- variables (text[]): variáveis dinâmicas no template
- channel_type (text): 'whatsapp', 'email', 'sms'
- category (text)
- version (integer)
- status (text): 'draft', 'active', 'archived'
- created_at (timestamp)
- updated_at (timestamp)

#### ai_settings
- id (uuid, primary key)
- model (text): modelo de IA utilizado
- temperature (float): parâmetro de temperatura para geração
- max_tokens (integer): limite de tokens
- auto_respond (boolean): ativar/desativar respostas automáticas
- sentiment_analysis (boolean): ativar/desativar análise de sentimento
- suggest_responses (boolean): ativar/desativar sugestões de resposta
- created_at (timestamp)
- updated_at (timestamp)

## Funcionalidades Principais

### Comunicação Omnichannel
- Integração com múltiplos canais
- Visão unificada das conversas
- Histórico centralizado
- Perfil único do usuário

### Gestão de Atendimento
- Filas de atendimento
- Distribuição automática
- SLA e métricas
- Avaliação de qualidade

### Inteligência e Automação
- Chatbots inteligentes
- Respostas automáticas
- Análise de sentimento
- Sugestões contextuais

### Relatórios e Analytics
- Dashboard de métricas
- Relatórios personalizáveis
- Análise de performance
- Insights automáticos

## Contribuição

Para contribuir com o projeto, siga os passos:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto é propriedade da Edunéxia e seu uso é restrito aos termos estabelecidos pela empresa.
