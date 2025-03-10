# Módulo de Comunicação da Edunéxia

O Módulo de Comunicação é uma solução completa e integrada para gerenciar todas as interações e comunicações dentro da plataforma educacional Edunéxia. Ele combina recursos de mensageria, inteligência artificial e gestão de canais para proporcionar uma experiência de comunicação eficiente e personalizada.

## Tecnologias Utilizadas

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Integrado-green)
![OpenAI](https://img.shields.io/badge/OpenAI-Integrado-green)

<<<<<<< HEAD
- Next.js 15.2.1 (App Router + RSC)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI + Radix UI
- TanStack Query
- Zod (validação)
- Server Actions
- Supabase (banco de dados e armazenamento)
- OpenAI API (inteligência artificial)

## Estrutura Principal

### 1. Sistema de Canais (/channels)
- Gestão de canais de comunicação (WhatsApp, E-mail, Chat, SMS, Notificações)
- Configuração de canais por perfil de usuário
- Integração com APIs externas
- Monitoramento de status e métricas

### 2. Sistema de Conversas (/conversations)
- Chat em tempo real
- Histórico de conversas
- Organização por contexto
- Sistema de priorização
- Suporte a mídia (imagens, documentos, áudio)

### 3. Inteligência Artificial (/ai)
- Configuração de modelos de IA
- Análise de sentimento
- Respostas automáticas inteligentes
- Classificação de mensagens
- Sugestões de resposta

### 4. Templates e Automação (/templates)
- Templates personalizáveis
- Variáveis dinâmicas
- Fluxos de comunicação automatizados
- Gatilhos baseados em eventos

## Melhorias de Performance

### 1. Cache Inteligente para Mensagens
O módulo utiliza TanStack Query com adaptador de cache persistente para otimizar o carregamento de mensagens e reduzir chamadas à API. As mensagens são armazenadas em cache por 5 minutos por padrão e persistem entre atualizações de página.

### 2. Suporte a Webhooks
Sistemas externos podem se integrar ao módulo de comunicação através de webhooks. Eventos como criação de mensagens e atualizações de conversas disparam notificações para endpoints registrados.

### 3. Sistema de Filas para Processamento Assíncrono
Tarefas em segundo plano como processamento de IA e notificações são tratadas através de um sistema de filas assíncrono, melhorando a responsividade da UI e a escalabilidade do sistema.

### 4. Métricas Detalhadas de Desempenho
O módulo rastreia métricas detalhadas de desempenho para chamadas de API, operações de cache e processamento de filas, fornecendo insights para otimização.

### 5. Backup Automático de Conversas
As conversas são automaticamente armazenadas em backup para garantir a durabilidade dos dados e permitir recuperação em caso de perda de dados.

## Configuração do Ambiente

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_supabase
OPENAI_API_KEY=sua_chave_api_openai
||||||| c81f4c1
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
=======
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
>>>>>>> devin/1741591814-communication-module
```

<<<<<<< HEAD
## Instalação e Execução
||||||| c81f4c1
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
=======
2. Instale as dependências:
```bash
npm install
# ou
pnpm install
```
>>>>>>> devin/1741591814-communication-module

<<<<<<< HEAD
```bash
# Instalar dependências
npm install
||||||| c81f4c1
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
=======
3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
SUPABASE_JWT_SECRET=seu_jwt_secret_do_supabase
OPENAI_API_KEY=sua_chave_api_da_openai
```
>>>>>>> devin/1741591814-communication-module

<<<<<<< HEAD
# Executar em modo de desenvolvimento
npm run dev
||||||| c81f4c1
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
=======
4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
# ou
pnpm dev
```
>>>>>>> devin/1741591814-communication-module

<<<<<<< HEAD
# Construir para produção
npm run build
||||||| c81f4c1
## Learn More
=======
## Estrutura do Banco de Dados (Supabase)
>>>>>>> devin/1741591814-communication-module

<<<<<<< HEAD
# Iniciar em modo de produção
npm start
```
||||||| c81f4c1
To learn more about Next.js, take a look at the following resources:
=======
### Tabelas Principais
>>>>>>> devin/1741591814-communication-module

<<<<<<< HEAD
## Documentação Adicional
||||||| c81f4c1
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
=======
#### channels
- id (uuid, primary key)
- name (text)
- type (text): 'whatsapp', 'email', 'chat', 'sms', 'push'
- status (text): 'active', 'inactive'
- config (jsonb): configurações específicas do canal
- created_at (timestamp)
- updated_at (timestamp)
>>>>>>> devin/1741591814-communication-module

<<<<<<< HEAD
Para mais detalhes sobre cada componente do sistema, consulte a pasta `src/docs/`:
||||||| c81f4c1
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
=======
#### conversations
- id (uuid, primary key)
- channel_id (uuid, foreign key)
- participants (text[]): lista de IDs dos participantes
- status (text): 'open', 'closed', 'pending'
- priority (text): 'low', 'medium', 'high'
- context (text): 'academic', 'administrative', 'support'
- created_at (timestamp)
- updated_at (timestamp)
>>>>>>> devin/1741591814-communication-module

<<<<<<< HEAD
- [Melhorias de Performance](./src/docs/performance-improvements.md) - Detalhes sobre as cinco principais melhorias de performance
- [Sistema de Backup](./src/docs/backup-system.md) - Documentação completa do sistema de backup automático
||||||| c81f4c1
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
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
>>>>>>> devin/1741591814-communication-module
