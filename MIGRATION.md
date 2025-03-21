# Guia de Migração - Estrutura Feature-First

Este documento descreve o processo de migração da estrutura atual do projeto para a arquitetura feature-first.

## Estruturas Redundantes Removidas

Como parte do processo de limpeza, as seguintes estruturas redundantes foram removidas:

1. **Providers duplicados**
   - `src/providers/ReactQueryProvider.tsx`
   - `src/providers/QueryProvider.tsx`
   - Mantivemos apenas `src/contexts/QueryProvider.tsx`

2. **Hooks duplicados**
   - `src/components/hooks/use-toast.ts`
   - Mantivemos apenas os hooks em `src/hooks`

3. **Diretórios duplicados**
   - `src/shared` (conceito migrado para a estrutura feature-first)
   - `src/modules` (sobreposto com `src/features`)

4. **Nomenclatura duplicada**
   - Padronizamos para nomes em português (comunicacao, acesso-negado) 
   - Removemos versões em inglês (communication, access-denied)

## Plano de Migração para Feature-First

A migração completa para a estrutura feature-first será realizada em fases:

### Fase 1: Consolidação de Providers (Concluída)
- Consolidação dos providers em `src/contexts`
- Remoção de providers duplicados

### Fase 2: Migração de Componentes
- Mover componentes de `src/components` para suas respectivas features
- Manter apenas componentes base de UI em `src/components/ui`

```bash
# Exemplo: Mover componentes de chat para a feature de chat
mv src/components/chat/* src/features/chat/components/
```

### Fase 3: Migração de Hooks
- Mover hooks específicos para suas respectivas features
- Manter apenas hooks genuinamente globais em `src/hooks`

```bash
# Exemplo: Mover hooks de chat para a feature de chat
mv src/hooks/useChat.ts src/features/chat/hooks/
mv src/hooks/use-chat-state.ts src/features/chat/hooks/
```

### Fase 4: Migração de Serviços
- Mover serviços específicos para suas respectivas features
- Manter apenas serviços genuinamente globais em `src/services`

```bash
# Exemplo: Mover serviços de chat para a feature de chat
mv src/services/conversation/* src/features/chat/services/
```

### Fase 5: Migração de Tipos
- Mover tipos específicos para suas respectivas features
- Manter apenas tipos globais em `src/types`

```bash
# Exemplo: Mover tipos específicos para suas features
mv src/types/chat.ts src/features/chat/types/
```

## Estrutura Final Desejada

```
src/
  ├── app/               # Rotas e páginas da aplicação (Next.js App Router)
  ├── components/        # Apenas componentes base de UI
  │   └── ui/            # Componentes Shadcn UI reutilizáveis
  │
  ├── contexts/          # Contextos React globais
  │
  ├── features/          # Diretório principal para as features
  │   ├── chat/          # Feature de chat (completa com components, hooks, services, types)
  │   ├── crm/           # Feature de CRM
  │   ├── ai/            # Feature de Inteligência Artificial
  │   └── settings/      # Feature de Configurações
  │
  ├── hooks/             # Apenas hooks genuinamente globais
  │
  ├── lib/               # Utilitários e bibliotecas compartilhadas
  │
  ├── services/          # Apenas serviços genuinamente globais
  │
  ├── types/             # Apenas tipos genuinamente globais
  │
  └── utils/             # Funções utilitárias globais
```

## Diretrizes para Novas Implementações

Enquanto a migração estiver em andamento, siga estas diretrizes para novas implementações:

1. **Novas Features**: Sempre implementadas seguindo a estrutura feature-first
2. **Novos Componentes**: 
   - Se específicos a uma feature: implementar diretamente na pasta da feature
   - Se genuinamente globais: implementar em `src/components/ui`
3. **Novos Hooks**: 
   - Se específicos a uma feature: implementar na pasta da feature
   - Se genuinamente globais: implementar em `src/hooks`
4. **Exportações**: 
   - Cada feature deve exportar sua API pública via `index.ts`
   - Nunca importe diretamente arquivos internos de uma feature

## Como Identificar Componentes para Migração

Use estes critérios para identificar para qual feature migrar um componente:

1. **Propósito Principal**: Qual o objetivo principal do componente?
2. **Dados Manipulados**: Quais dados o componente manipula?
3. **Dependências**: De quais serviços e hooks o componente depende?
4. **Reutilização**: O componente é específico ou reutilizado em várias áreas?

## Testes Durante a Migração

É essencial testar cada parte da aplicação após mover componentes:

1. Verificar se rotas relevantes ainda funcionam
2. Verificar se interações de UI continuam funcionando 
3. Verificar se fluxos de negócio continuam intactos
4. Verificar se a tipagem continua correta

## Ferramentas Úteis Durante a Migração

- Script `cleanup-duplicates.sh` para remover estruturas redundantes
- Testes para garantir que a funcionalidade permanece intacta 