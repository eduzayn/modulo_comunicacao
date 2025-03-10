# Módulo de Comunicação da Edunéxia

O Módulo de Comunicação é uma solução completa e integrada para gerenciar todas as interações e comunicações dentro da plataforma educacional Edunéxia. Ele combina recursos de mensageria, inteligência artificial e gestão de canais para proporcionar uma experiência de comunicação eficiente e personalizada.

## Tecnologias Utilizadas

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
```

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar em modo de produção
npm start
```

## Documentação Adicional

Para mais detalhes sobre cada componente do sistema, consulte a pasta `src/docs/`:

- [Melhorias de Performance](./src/docs/performance-improvements.md) - Detalhes sobre as cinco principais melhorias de performance
- [Sistema de Backup](./src/docs/backup-system.md) - Documentação completa do sistema de backup automático
