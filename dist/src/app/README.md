# Estrutura do Aplicativo

Este documento fornece uma visão geral da estrutura do aplicativo e diretrizes importantes para o desenvolvimento.

## Estrutura Principal

- `src/app/` - Diretório principal contendo todas as rotas da aplicação (usando App Router do Next.js)
- `src/components/` - Componentes reutilizáveis
- `src/lib/` - Utilitários e funções auxiliares
- `src/services/` - Serviços de API e integração
- `src/hooks/` - Custom hooks React
- `src/contexts/` - Contextos React para gerenciamento de estado
- `src/types/` - Definições de tipos TypeScript

## Atualizações Recentes

### Remoção de Pastas Obsoletas

- A pasta `(communication)` foi removida por causar conflitos com a pasta `communication`
- Um backup das páginas removidas está disponível em `src/app/obsolete-backup/`

### Planos de Consolidação

- Consulte `src/app/communication/MIGRATION.md` para o plano de consolidação do módulo de comunicação
- Consulte `src/app/settings/README.md` para entender a estrutura de configurações

## Problemas Conhecidos

### 1. Duplicação de Rotas de Comunicação

O módulo de comunicação ainda possui algumas duplicações que serão resolvidas conforme o plano de migração:
- Pastas `mensagens/` e `messages/` duplicadas
- `conversations/` deve ser renomeada para `conversas/` para padronização

### 2. Configurações Redundantes

A separação entre configurações gerais e específicas está documentada:
- Configurações gerais: `src/app/settings/`
- Configurações específicas: dentro de cada módulo em `settings/`

### 3. Rotas Aninhadas Profundamente

Existem algumas rotas aninhadas muito profundamente que podem causar problemas de navegação e UI.

**Recomendação**: Limitar o aninhamento a 3 níveis máximos quando possível.

## Boas Práticas Atualizadas

1. **Layouts Consolidados**:
   - Use layouts com moderação e não aninhamento excessivo
   - Cada seção principal deve ter apenas um layout

2. **Nomenclatura Consistente**:
   - Use kebab-case para nomes de arquivos e pastas
   - Padronize os nomes em português para consistência da interface

3. **Páginas vs. Componentes**:
   - Mantenha arquivos `page.tsx` simples, movendo a lógica para componentes
   - Use Server Components quando possível para melhorar performance

4. **Roteamento Claro**:
   - Evite rotas com nomes confusos ou similares
   - Não use grupos de rota (`(group)`) a menos que seja absolutamente necessário

5. **Separação de Responsabilidades**:
   - Mantenha a lógica de negócios fora dos componentes de UI
   - Use serviços para interações com API

## Módulos Principais

- **Admin**: Área administrativa (`/admin`)
- **Comunicação**: Sistema de comunicação unificado (`/communication`)
- **Configurações**: Configurações do sistema (`/settings`)
- **Caixa de Entrada**: Caixa de entrada unificada (`/inbox`)
- **CRM**: Gestão de relacionamento com cliente (`/crm`)
- **Calendário**: Calendário e agendamento (`/calendar`)
- **Relatórios**: Relatórios e estatísticas (`/reports`)

## Como Contribuir

Ao adicionar novas páginas ou funcionalidades:

1. Verifique se não há duplicação com páginas existentes
2. Siga a estrutura e convenções estabelecidas
3. Documente alterações significativas
4. Atualize os READMEs relevantes conforme necessário
5. Siga o plano de migração para o módulo de comunicação 