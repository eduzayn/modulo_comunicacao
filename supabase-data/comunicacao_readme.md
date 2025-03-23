# Módulo de Comunicação - Integração com Supabase

Este documento descreve a integração do Módulo de Comunicação com o Supabase como banco de dados e serviço de backend.

## Estrutura do Banco de Dados

O sistema utiliza o Supabase como seu principal backend, aproveitando tanto o banco de dados PostgreSQL quanto os serviços adicionais oferecidos pela plataforma.

### Diretório `supabase-data`

Este diretório contém arquivos JSON e markdown que documentam a estrutura e configuração do banco de dados:

- `tables.json` - Lista de todas as tabelas no banco de dados
- `table_structures.json` - Estrutura detalhada de cada tabela (colunas, tipos, etc.)
- `foreign_keys.json` - Relacionamentos entre tabelas (chaves estrangeiras)
- `functions.json` - Funções PostgreSQL personalizadas
- `rls_status.json` - Status de Row Level Security (RLS) para cada tabela
- `rls_policies.json` - Políticas de RLS detalhadas
- `db_schema_summary.md` - Resumo da estrutura do banco de dados em formato markdown

## Principais Áreas Funcionais

O banco de dados está organizado em áreas funcionais que correspondem às features do sistema:

### Canais de Comunicação
- Tabelas como `channels`, `channel_integrations`
- Configurações de widgets para comunicação web

### Caixa de Entrada (Inbox)
- Tabelas de `conversations`, `messages`, `inboxes`
- Sistema para gerenciamento de conversas multi-canal

### Sistema de CRM
- Tabelas de `contacts`, `deals`, `pipelines`
- Gerenciamento de contatos e oportunidades de vendas

### IA e Automação
- Tabelas de `ai_sessions`, `ai_messages`, `ai_prompts`
- Automações com `automations`, `workflows`, `bots`

### Gerenciamento de Usuários
- Integração com `auth.users` do Supabase Auth
- Tabelas adicionais como `profiles`, `teams`, `permissions`

## Segurança com Row Level Security (RLS)

O sistema faz uso extensivo de Row Level Security do PostgreSQL para controle de acesso aos dados:

- A maioria das tabelas tem RLS ativado conforme documentado em `rls_status.json`
- Políticas específicas definem quem pode visualizar e modificar dados
- Implementação de segurança multi-tenant onde aplicável

## Uso em Desenvolvimento

### Conexão com Supabase

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Consultas Típicas

```typescript
// Exemplo de consulta com filtro RLS (usuário atual)
const { data, error } = await supabase
  .from('conversations')
  .select('id, messages(*)')
  .order('created_at', { ascending: false })
```

## Migrações e Atualizações

- O schema do banco de dados é versionado e sincronizado com o código
- Alterações devem ser documentadas nos arquivos em `supabase-data`
- Migrações são aplicadas via pipeline de CI/CD ou scripts dedicados

## Desenvolvimento Local

Para desenvolvimento local, recomenda-se:

1. Utilizar Supabase CLI para executar uma instância local
2. Ou conectar-se a um projeto de desenvolvimento no Supabase Cloud
3. Manter as variáveis de ambiente em `.env.local` atualizadas

## Considerações de Desempenho

- Índices são criados para consultas frequentes
- Views materializadas são utilizadas para relatórios complexos
- Funções PostgreSQL otimizam operações complexas no servidor

## Integrações Externas

O Supabase também é utilizado para:

- Autenticação e gerenciamento de usuários
- Armazenamento de arquivos (Storage)
- Functions serverless (quando aplicável)
- Realtime para atualizações em tempo real 