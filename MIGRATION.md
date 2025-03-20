# Documentação da Migração para Arquitetura Feature-First

Este documento descreve o processo de migração do projeto para uma arquitetura feature-first, focada em organizar o código por funcionalidades de negócio em vez de tipos técnicos.

## Resumo da Migração

As seguintes features foram migradas para a nova estrutura:

1. **Chat**: Sistema de mensagens e conversas
2. **CRM**: Sistema de gerenciamento de relacionamento com clientes
3. **IA**: Sistema de análise de mensagens e configuração de inteligência artificial
4. **Settings**: Sistema de configurações do sistema

## Estrutura Anterior vs. Nova Estrutura

### Estrutura Anterior:
```
src/
  ├── components/       # Todos os componentes
  ├── hooks/            # Todos os hooks
  ├── services/         # Todos os serviços
  ├── types/            # Todos os tipos
  └── ...
```

### Nova Estrutura:
```
src/
  ├── features/          # Organizado por funcionalidade
  │   ├── chat/          # Feature de chat
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   ├── services/
  │   │   ├── types/
  │   │   └── index.ts
  │   ├── crm/
  │   ├── ai/
  │   ├── settings/      # Feature de configurações
  │   │   ├── components/
  │   │   │   ├── automations/
  │   │   │   ├── bots/
  │   │   │   └── ...
  │   │   ├── hooks/
  │   │   ├── services/
  │   │   ├── types/
  │   │   └── index.ts
  │   └── ...
  ├── app/               # Rotas e páginas
  ├── components/        # Componentes compartilhados 
  └── lib/               # Utilitários compartilhados
```

## Mudanças Realizadas

### 1. Migração do Chat

- Migração dos tipos de `src/types/chat.ts` para `src/features/chat/types/chat.types.ts`
- Migração do serviço de chat de `src/services/ai.ts` para `src/features/chat/services/chat-service.ts`
- Migração do hook useChat de `src/hooks/useChat.ts` para `src/features/chat/hooks/use-chat.ts`
- Criação de componentes específicos do chat em `src/features/chat/components/`
- Criação de um arquivo de exportação em `src/features/chat/index.ts`
- Documentação específica em `src/features/chat/README.md`

### 2. Migração do CRM

- Criação de tipos específicos em `src/features/crm/types/crm.types.ts`
- Implementação de serviços para gerenciamento de contatos e negociações
- Criação de hooks para gerenciamento de estado do CRM
- Implementação de componentes para visualização de contatos e negociações
- Documentação específica em `src/features/crm/README.md`

### 3. Migração da IA

- Migração dos tipos de `src/types/ai.ts` para `src/features/ai/types/ai.types.ts`
- Migração do serviço de IA de `src/services/openai/index.ts` para `src/features/ai/services/ai-service.ts`
- Criação de hooks para gerenciamento de configurações e análise de mensagens
- Implementação de componentes para configuração e visualização de análises
- Documentação específica em `src/features/ai/README.md`

### 4. Migração das Configurações (Settings)

- Migração dos componentes de `src/components/settings/` para `src/features/settings/components/`
  - Migração de `create-automation-form.tsx` para `AutomationForm.tsx`
  - Migração de `create-bot-form.tsx` para `BotForm.tsx`
- Criação de tipos específicos em `src/features/settings/types/settings.types.ts`
- Implementação de serviços para gerenciamento de configurações em `src/features/settings/services/settings-service.ts`
- Criação de hooks para gerenciamento de configurações em `src/features/settings/hooks/use-settings.ts`
- Atualização das páginas em `src/app/settings/` para usar a nova estrutura
- Documentação específica em `src/features/settings/README.md`

## Arquivos Removidos

Os seguintes arquivos foram removidos após a migração bem-sucedida:

- `src/types/chat.ts`
- `src/types/ai.ts`
- `src/services/openai/index.ts`
- `src/components/settings/automations/create-automation-form.tsx`
- `src/components/settings/bots/create-bot-form.tsx`

## Páginas de Exemplo

Foram criadas páginas de exemplo para demonstrar o uso das features:

- `/examples` - Página principal com cards para todas as features
- `/examples/chat` - Demonstração do sistema de chat
- `/examples/crm` - Demonstração do sistema de CRM
- `/examples/ai` - Demonstração das funcionalidades de IA

## Integração entre Features

Algumas features se relacionam com outras:

- **Settings → Inbox**: As configurações de canais são utilizadas pela caixa de entrada
- **Settings → CRM**: As configurações de pipeline são utilizadas pelo CRM
- **Settings → Chat**: As configurações de bots são utilizadas pelo chat

Essas integrações são feitas através das APIs públicas de cada feature.

## Benefícios da Nova Arquitetura

1. **Melhor organização**: Código relacionado está agrupado por funcionalidade
2. **Facilidade de manutenção**: Alterações em uma feature são localizadas
3. **Melhor colaboração**: Equipes podem trabalhar em features separadas
4. **Coesão**: Cada diretório de feature contém tudo necessário para aquela funcionalidade
5. **Encapsulamento**: Implementações internas de uma feature são encapsuladas
6. **APIs bem definidas**: Cada feature expõe uma API clara através do arquivo `index.ts`

## Próximos Passos

1. Continuar migrando outras funcionalidades para a estrutura feature-first
2. Refatorar os componentes compartilhados para serem reutilizáveis
3. Implementar testes específicos para cada feature
4. Documentar mais detalhadamente a integração entre as features 