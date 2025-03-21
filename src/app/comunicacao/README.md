# Módulo de Comunicação

Este diretório contém o módulo de comunicação do sistema, responsável pelas funcionalidades de mensagens, chats, contatos e outras comunicações.

## Estrutura

- `layout.tsx` - Layout principal para todas as páginas de comunicação
- `page.tsx` - Página inicial do módulo de comunicação
- `routes.tsx` - Definição de rotas e navegação para o módulo

## Consolidação

Este módulo está sendo consolidado para substituir a pasta `(communication)` que será removida.

### Motivos da Consolidação

1. Eliminar rotas duplicadas que causam conflitos
2. Simplificar a navegação e a estrutura do sistema
3. Melhorar a manutenibilidade do código
4. Unificar a experiência do usuário

### Plano de Migração

1. Migrar gradualmente as páginas de `(communication)` para esta pasta
2. Atualizar links e referências
3. Remover a pasta `(communication)` após a migração completa

## Subpáginas

- `communication/settings/` - Configurações específicas do módulo de comunicação
- `communication/stats/` - Estatísticas e relatórios do módulo de comunicação
- `communication/contacts/` - Gerenciamento de contatos

## Como Desenvolver

Ao adicionar novas funcionalidades ao módulo de comunicação:

1. Sempre adicione as novas páginas nesta pasta (não em `(communication)`)
2. Atualize o arquivo `routes.tsx` com as novas rotas
3. Mantenha a consistência com o layout existente 