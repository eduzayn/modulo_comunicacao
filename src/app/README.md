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

### Padronização de Nomenclatura

- Todos os diretórios e arquivos foram padronizados para usar nomes em inglês
- As pastas com nomes em português foram substituídas por equivalentes em inglês
- Um middleware de redirecionamento foi configurado para garantir compatibilidade com URLs antigas

### Remoção de Duplicações

Foram removidas as seguintes duplicações:
- Pastas duplicadas `communication` e `comunicacao`
- Pastas duplicadas `mensagens` e `messages`  
- Pastas duplicadas `conversas` e `conversations`
- Pastas duplicadas `acesso-negado` e `access-denied`
- Pastas duplicadas em `admin`: `agenda`/`calendar`, `horas`/`hours`, `relatorios`/`reports`, `usuarios`/`users`

## Boas Práticas Atualizadas

1. **Layouts Consolidados**:
   - Use layouts com moderação e não aninhamento excessivo
   - Cada seção principal deve ter apenas um layout

2. **Nomenclatura Consistente**:
   - Use kebab-case para nomes de arquivos e pastas
   - Use nomes em inglês para todos os arquivos e diretórios
   - Use nomes em português apenas para conteúdo visível ao usuário final

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
- **Communication**: Sistema de comunicação unificado (`/communication`)
- **Settings**: Configurações do sistema (`/settings`)
- **Inbox**: Caixa de entrada unificada (`/inbox`)
- **CRM**: Gestão de relacionamento com cliente (`/crm`)
- **Calendar**: Calendário e agendamento (`/calendar`)
- **Reports**: Relatórios e estatísticas (`/reports`)

## Como Contribuir

Ao adicionar novas páginas ou funcionalidades:

1. Verifique se não há duplicação com páginas existentes
2. Siga a estrutura e convenções estabelecidas
3. Documente alterações significativas
4. Atualize os READMEs relevantes conforme necessário
5. Mantenha a consistência com nomes em inglês para diretórios e arquivos 