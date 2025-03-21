# ⚠️ PASTA RENOMEADA - NÃO REMOVER AINDA ⚠️

## Esta pasta foi renomeada para `comunicacao`

Como parte do plano de padronização dos nomes em português, esta pasta `communication` foi duplicada para `comunicacao`. 

### ⚠️ AVISOS IMPORTANTES DE SEGURANÇA ⚠️

1. **NÃO REMOVA ESTA PASTA** até que todas as referências tenham sido atualizadas e testadas
2. **A REMOÇÃO PREMATURA** pode quebrar importações, links e rotas existentes
3. **MANTENHA AMBAS AS ESTRUTURAS** durante o período de transição 

### Processo de Migração Segura

Para garantir uma migração segura:

1. Toda nova funcionalidade deve ser adicionada na pasta `comunicacao`
2. Atualize gradualmente as referências para usar a nova pasta
3. Um middleware de redirecionamento será implementado para rotas antigas
4. Apenas remova esta pasta após confirmar que não há mais referências

### Documentação Completa

Para detalhes completos sobre o plano de migração, consulte:
- `/src/app/comunicacao/MIGRATION.md` - Plano detalhado com todas as fases

### Pasta de hooks relacionada

A pasta de hooks `/src/app/hooks/communication` também será renomeada para `/src/app/hooks/comunicacao` como parte deste processo.

## Data da migração

A migração iniciou em: [data atual]

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