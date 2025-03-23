# Organização de Hooks - Módulo Comunicação

Este documento estabelece diretrizes para a organização e estruturação dos hooks no projeto, visando clareza e manutenibilidade.

## Princípios Gerais

1. **Separação de Responsabilidades**: Cada hook deve ter uma responsabilidade única e bem definida.
2. **Nomeação Consistente**: Todos os hooks seguem a convenção de nomenclatura kebab-case com prefixo `use-`.
3. **Documentação**: Todos os hooks devem incluir comentários JSDoc descrevendo sua função e parâmetros.
4. **Tipagem**: Todos os hooks devem utilizar TypeScript para definição de tipos.

## Estrutura de Diretórios

A organização dos hooks segue a seguinte estrutura:

### 1. Hooks Globais (`src/hooks/`)

Hooks que são utilizados por várias funcionalidades da aplicação e não estão vinculados a um domínio específico:

- **Hooks de Utilidade**: `use-local-storage.ts`, `use-media-query.ts`, `use-debounce.ts`
- **Hooks de UI**: `use-toast.ts`, `use-modal.ts`, `use-disclosure.ts`
- **Hooks de Estado Global**: `use-auth.ts`, `use-settings.ts`

### 2. Hooks de Funcionalidade (`src/features/[feature]/hooks/`)

> Nota: Estes hooks serão migrados para a pasta específica da feature após implementação da arquitetura feature-first.

Hooks específicos de uma funcionalidade ou domínio:

- **Hooks de Domínio**: `use-contacts.ts`, `use-conversations.ts`, `use-messages.ts`
- **Hooks de Fluxo**: `use-onboarding.ts`, `use-checkout.ts`

### 3. Hooks de Componentes (`src/components/[component]/use-[component].ts`)

> Nota: No futuro, estes hooks serão incorporados no mesmo diretório do componente ao qual se relacionam.

Hooks específicos para um componente complexo:

- **Hooks de Estado de Componente**: `use-datatable.ts`, `use-form.ts`
- **Hooks de Comportamento**: `use-drag-drop.ts`, `use-infinite-scroll.ts`

## Status de Migração

### Fase 1: Organização Inicial (Em andamento)

- ✅ Padronização da nomenclatura de hooks para kebab-case
- ✅ Criação de documentação de padrões
- ✅ Migração de hooks básicos para a estrutura padrão
  - ✅ `useTextToSpeech.ts` → `use-text-to-speech.ts`
  - ✅ `useChatState.ts` → `use-chat-state.ts`
  - ✅ `useContacts.ts` → `use-contacts.ts`
  - ✅ Criação de `use-toast-provider.tsx` (adaptado de `components/hooks/use-toast.ts`)
- ⬜ Consolidação de hooks duplicados
  - ⬜ Hooks de toast (necessário garantir compatibilidade)
  - ⬜ Hooks de comunicação
  - ⬜ Hooks de configurações

### Fase 2: Consolidação (Próxima etapa)

- ⬜ Mover hooks de `src/app/hooks` para a estrutura apropriada
- ⬜ Mover hooks de `src/components/hooks` para `src/hooks`
- ⬜ Atualizar importações para usar os novos caminhos
- ⬜ Depreciar versões antigas com avisos

### Fase 3: Arquitetura Feature-First (Futuro)

- ⬜ Implementar estrutura de diretórios feature-first
- ⬜ Mover hooks para suas respectivas features
- ⬜ Documentar nova estrutura

## Regras de Migração

Para garantir uma transição suave, seguiremos estas regras:

1. **Novos Hooks**: Devem ser criados seguindo a estrutura acima.
2. **Hooks Existentes**: Serão gradualmente migrados para a estrutura correta.
3. **Hooks Duplicados**: Se existirem hooks com funcionalidade similar, consolidar em um único hook.

### Processo de Migração

1. **Fase 1**: Mover hooks de `src/components/hooks` para `src/hooks`
2. **Fase 2**: Consolidar hooks duplicados entre `src/app/hooks` e `src/hooks`
3. **Fase 3**: Mover hooks específicos de feature para `src/features/[feature]/hooks/` (após implementação da arquitetura feature-first)

## Princípios de Design de Hooks

1. **Composição**: Prefira compor hooks menores para criar funcionalidades mais complexas.
2. **Inversão de Controle**: Quando apropriado, permita que os consumidores do hook forneçam partes da implementação.
3. **Estado Mínimo**: Mantenha o estado interno do hook o mais mínimo possível.
4. **Limpeza**: Sempre limpe recursos (event listeners, timers) no retorno do useEffect.

## Exemplos de Uso

### Hook Global

```typescript
// src/hooks/use-debounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### Hook de Funcionalidade

```typescript
// Futuramente: src/features/messaging/hooks/use-conversations.ts
export function useConversations() {
  // Implementação específica da feature
}
```

### Hook de Componente

```typescript
// Futuramente: src/components/data-table/use-data-table.ts
export function useDataTable<T>(data: T[], options: DataTableOptions) {
  // Implementação específica do componente
}
``` 