# Módulo de Comunicação da Edunéxia

O Módulo de Comunicação é uma solução completa e integrada para gerenciar todas as interações e comunicações dentro da plataforma educacional Edunéxia. Ele combina recursos de mensageria, inteligência artificial e gestão de canais para proporcionar uma experiência de comunicação eficiente e personalizada.

## Estrutura Principal

### 1. Sistema de Canais (/channels)
- Gestão de Canais de Comunicação
  - WhatsApp Business API
  - E-mail Marketing
  - Chat Interno
  - SMS
  - Notificações Push
- Recursos dos Canais
  - Configuração de canais por perfil de usuário
  - Integração com APIs externas
  - Monitoramento de status
  - Métricas de entrega e engajamento

### 2. Sistema de Conversas (/conversations)
- Gestão de Conversas
  - Chat em tempo real
  - Histórico de conversas
  - Organização por contexto (acadêmico, administrativo, suporte)
  - Sistema de priorização
- Recursos de Conversação
  - Troca de mensagens em tempo real
  - Suporte a mídia (imagens, documentos, áudio)
  - Marcação de mensagens importantes
  - Filtros e busca avançada

### 3. Inteligência Artificial (/ai)
- AI Settings
  - Configuração de modelos de IA
  - Personalização de respostas automáticas
  - Treinamento de modelos específicos
- Recursos de IA
  - Análise de sentimento
  - Respostas automáticas inteligentes
  - Classificação de mensagens
  - Sugestões de resposta
  - Base de conhecimento automatizada

### 4. Sistema de Email (/email)
- Configuração de Email
  - Configuração de SMTP
  - Gerenciamento de credenciais
  - Personalização de remetente
- Templates de Email
  - Criação e edição de templates HTML/texto
  - Suporte a variáveis dinâmicas
  - Versionamento de templates
- Envio de Emails
  - Envio individual ou em lote
  - Agendamento de envios
  - Substituição de variáveis
- Logs de Email
  - Rastreamento de envios
  - Status de entrega
  - Histórico de emails enviados

## Tecnologias Utilizadas

- **Frontend**: Next.js 15.2.1 (App Router + RSC), React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Server Actions
- **Banco de Dados**: Supabase (PostgreSQL)
- **Inteligência Artificial**: OpenAI API
- **Gerenciamento de Estado**: TanStack Query
- **Validação**: Zod
- **Cache**: TanStack Query com estratégias de cache inteligente

## Funcionalidades Principais

- **Comunicação Omnichannel**: Integração com múltiplos canais e visão unificada das conversas
- **Gestão de Atendimento**: Filas, distribuição automática, SLA e métricas
- **Inteligência e Automação**: Chatbots, respostas automáticas e análise de sentimento
- **Sistema de Email**: Configuração SMTP, templates, envio e logs
- **Relatórios e Analytics**: Dashboard de métricas e análise de performance
- **Webhooks**: Integração com sistemas externos
- **Sistema de Filas**: Processamento assíncrono de mensagens
- **Backup Automático**: Backup programado de conversas e configurações

## Instalação e Configuração

```bash
# Clonar o repositório
git clone https://github.com/eduzayn/modulo_comunicacao.git
cd modulo_comunicacao

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Iniciar o servidor de desenvolvimento
npm run dev
```

### Configuração do Supabase

O módulo utiliza Supabase como banco de dados. Configure as seguintes variáveis de ambiente:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
```

### Configuração do OpenAI

Para utilizar os recursos de IA, configure a chave da API OpenAI:

```
OPENAI_API_KEY=sua_chave_da_api_openai
```

### Configuração de Email

Configure as variáveis de ambiente para o sistema de email:

```
SMTP_HOST=seu_servidor_smtp
SMTP_PORT=porta_smtp
SMTP_USER=usuario_smtp
SMTP_PASSWORD=senha_smtp
EMAIL_FROM=seu_email@exemplo.com
EMAIL_FROM_NAME="Seu Nome"
```

## Documentação

Para mais informações sobre o módulo de comunicação, consulte a documentação completa em `/docs`.

## Licença

Este projeto é propriedade da Eduzayn e está protegido por direitos autorais. Todos os direitos reservados.
