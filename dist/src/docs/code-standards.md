# Padrões de Código - Modulo Comunicação

## Convenções de Nomenclatura

Este documento estabelece padrões de nomenclatura para garantir consistência em todo o projeto. Siga estas convenções para todos os novos arquivos e durante o refatoramento.

### Diretórios/Pastas

- **Regra:** Use kebab-case para todas as pastas
- **Exemplos corretos:** `page-container`, `api-docs`, `form-components`
- **Exceções:** 
  - Pastas de rota no Next.js App Router podem seguir a convenção do Next.js
  - Grupos de rota do Next.js com parênteses: `(auth)`, `(dashboard)`

### Arquivos de Componentes React

- **Regra:** Use PascalCase para componentes React
- **Exemplos corretos:** `Button.tsx`, `Sidebar.tsx`, `UserProfile.tsx`
- **Observação:** Arquivos que exportam múltiplos componentes pequenos podem usar kebab-case: `ui-elements.tsx`

### Arquivos de Hooks

- **Regra:** Use kebab-case com prefixo `use-` para todos os hooks
- **Exemplos corretos:** `use-chat.ts`, `use-toast.ts`, `use-form.ts`
- **Exemplos incorretos:** `useChat.ts`, `UseToast.ts`

### Arquivos de Utilitários/Helpers

- **Regra:** Use kebab-case para todos os utilitários
- **Exemplos corretos:** `api-client.ts`, `form-helpers.ts`, `date-utils.ts`

### Arquivos de Configuração

- **Regra:** Use kebab-case para arquivos de configuração
- **Exemplos corretos:** `query-client.ts`, `supabase-config.ts`

### Arquivos de Tipos/Interfaces

- **Regra:** Use kebab-case com sufixo `.types.ts`
- **Exemplos corretos:** `user.types.ts`, `api.types.ts`, `form.types.ts`

### Arquivos de Contexto

- **Regra:** Use kebab-case com sufixo `.context.tsx`
- **Exemplos corretos:** `auth.context.tsx`, `theme.context.tsx`

### Arquivos de Serviços

- **Regra:** Use kebab-case com nome descritivo
- **Exemplos corretos:** `supabase-auth.ts`, `api-integration.ts`

## Convenções de Código

### Componentes React

- Use componentes funcionais com hooks
- Defina interfaces TypeScript para props
- Coloque interfaces no final do arquivo
- Exporte usando `export function ComponentName()`

### Hooks

- Inicie sempre com prefixo "use-"
- Mantenha hooks simples e com responsabilidade única
- Documente a função do hook com comentários JSDoc

### Tipos TypeScript

- Prefira interfaces para definições de objetos
- Use tipos para unions e tipos complexos
- Nomeie interfaces com "I" prefixado: `IUser`, `IFormProps`
- Nomeie tipos com "T" prefixado: `TUserRole`, `TFormState`

## Processo de Migração

Para arquivos existentes, a migração para estes padrões deve ser feita gradualmente:

1. Priorize a padronização de arquivos novos
2. Ao modificar um arquivo existente, renomeie-o seguindo o padrão
3. Atualize importações afetadas
4. Verifique se o renomeamento não causou quebras

## Verificação Automática

Estamos implementando regras de linting para ajudar a manter estes padrões. Enquanto isso, por favor siga estas convenções manualmente. 