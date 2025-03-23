# Arquitetura Feature-First - Módulo Comunicação

Este documento estabelece os padrões e diretrizes para a organização feature-first (baseada em funcionalidades) do projeto, promovendo coesão, modularidade e melhor manutenibilidade.

## Problema Atual

Atualmente, o projeto está organizado principalmente por tipos (components, hooks, services), o que causa problemas como:

1. **Acoplamento Implícito**: Componentes e lógica relacionados estão espalhados em diferentes diretórios
2. **Dificuldade de Navegação**: Desenvolvedores precisam navegar por múltiplos diretórios para entender uma funcionalidade
3. **Reuso Comprometido**: Difícil identificar quais partes são específicas de uma feature e quais são compartilhadas
4. **Complexidade de Manutenção**: Mudanças em uma feature afetam múltiplos locais
5. **Onboarding Mais Lento**: Novos desenvolvedores precisam entender toda a estrutura do projeto

## Arquitetura Feature-First

Na arquitetura feature-first, o código é organizado primariamente por domínios ou funcionalidades de negócio, em vez de por tipos técnicos. Cada feature contém todos os componentes, hooks, serviços e outros artefatos necessários para sua implementação.

### Princípios

1. **Coesão**: Elementos relacionados a uma mesma feature ficam juntos.
2. **Encapsulamento**: Cada feature expõe apenas uma API pública clara.
3. **Modularidade**: Features podem ser desenvolvidas, testadas e mantidas de forma independente.
4. **Reutilização Explícita**: Componentes compartilhados são claramente identificados.
5. **Escalabilidade**: Novas features podem ser adicionadas sem afetar as existentes.

## Estrutura de Diretórios Proposta

```
src/
├── features/                  # Todas as features do sistema
│   ├── chat/                  # Exemplo de feature
│   │   ├── components/        # Componentes específicos desta feature
│   │   ├── hooks/             # Hooks específicos desta feature
│   │   ├── services/          # Serviços específicos desta feature 
│   │   ├── types/             # Tipos e interfaces da feature
│   │   ├── utils/             # Utilitários específicos da feature
│   │   └── index.ts           # Arquivo de exportação pública da feature
│   ├── ai-assistant/          # Outra feature do sistema
│   │   ├── components/
│   │   └── ...
│   └── ...
├── shared/                    # Código compartilhado entre features
│   ├── components/            # Componentes compartilhados (UI Kit)
│   ├── hooks/                 # Hooks reutilizáveis
│   ├── services/              # Serviços compartilhados
│   ├── utils/                 # Utilitários gerais
│   └── ...
├── app/                       # Next.js App Router (permanece igual)
├── lib/                       # Bibliotecas e configurações
└── ...                        # Outros arquivos/diretórios de nível raiz
```

## Features Principais Identificadas

Com base na análise do código atual, identificamos as seguintes features principais:

1. **Chat** (`/features/chat`): Sistema de chat em tempo real, mensagens, etc.
2. **AI** (`/features/ai`): Assistente de IA, configurações, etc.
3. **Contatos** (`/features/contacts`): Gerenciamento de contatos, CRM, etc.
4. **Canais** (`/features/channels`): Configuração e gerenciamento de canais de comunicação.
5. **Templates** (`/features/templates`): Criação e gerenciamento de templates.
6. **Relatórios** (`/features/reports`): Relatórios, métricas e estatísticas.

## Padrões de Implementação

### Estrutura de uma Feature

Cada feature deve seguir esta estrutura básica:

```
features/feature-name/
├── components/           # Componentes da feature
│   ├── FeatureMain.tsx   # Componente principal
│   └── ...
├── hooks/                # Hooks específicos da feature
│   ├── use-feature.ts    # Hook principal da feature
│   └── ...
├── services/             # Serviços e APIs
│   ├── feature-service.ts
│   └── ...
├── types/                # Tipos e interfaces
│   ├── feature.types.ts
│   └── ...
├── utils/                # Utilitários específicos da feature
│   ├── feature-utils.ts
│   └── ...
└── index.ts              # Exporta a API pública da feature
```

### Arquivo index.ts

O arquivo `index.ts` deve expor apenas o que outras features podem consumir:

```typescript
// features/chat/index.ts
export { ChatContainer } from './components/ChatContainer';
export { useChat } from './hooks/use-chat';
export type { ChatMessage, ChatThread } from './types/chat.types';
```

### Importações Entre Features

As importações entre features devem ser sempre feitas através dos arquivos `index.ts`:

```typescript
// CORRETO: Importação via index.ts
import { ChatContainer, useChat } from '@/features/chat';

// INCORRETO: Importação direta de subdiretórios
import { ChatContainer } from '@/features/chat/components/ChatContainer';
```

## Estratégia de Migração

A migração para uma arquitetura feature-first será feita gradualmente, seguindo estas fases:

### Fase 1: Preparação

1. Criar a estrutura básica de diretórios (`features/` e `shared/`)
2. Identificar componentes e utilitários claramente compartilhados
3. Estabelecer padrões de nomenclatura e importação

### Fase 2: Migração Feature por Feature

Para cada feature identificada:

1. Criar a estrutura de diretórios da feature
2. Mover componentes relacionados para `features/feature-name/components/`
3. Mover hooks relacionados para `features/feature-name/hooks/`
4. Mover serviços relacionados para `features/feature-name/services/`
5. Mover tipos relacionados para `features/feature-name/types/`
6. Criar o arquivo `index.ts` com as exportações públicas
7. Atualizar as importações em outros arquivos

### Fase 3: Migração do Código Compartilhado

1. Identificar código verdadeiramente compartilhado
2. Mover para a estrutura `shared/`
3. Atualizar importações

### Fase 4: Limpeza

1. Remover diretórios antigos que foram totalmente migrados
2. Atualizar documentação
3. Validar funcionalidade

## Prioridades de Migração

Começaremos a migração pelas seguintes features, em ordem de prioridade:

1. **Chat**: Sistema de chat e mensageria
2. **AI**: Funcionalidades de IA
3. **Contacts**: Sistema de contatos e CRM
4. **Channels**: Canais de comunicação
5. **Templates**: Sistema de templates

## Exemplos de Migração

### Antes

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   └── ...
├── hooks/
│   ├── useChat.ts
│   └── ...
├── services/
│   ├── chat.ts
│   └── ...
```

### Depois

```
src/
├── features/
│   ├── chat/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── use-chat.ts
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── chat-service.ts
│   │   │   └── ...
│   │   └── index.ts
```

## Benefícios Esperados

1. **Melhor Organização**: Código relacionado está junto, facilitando a navegação
2. **Menor Acoplamento**: Features claramente separadas com interfaces bem definidas
3. **Manutenção Simplificada**: Alterações em uma feature ficam contidas nela
4. **Onboarding Facilitado**: Desenvolvedores podem entender uma feature de cada vez
5. **Testabilidade Melhorada**: Features podem ser testadas isoladamente 