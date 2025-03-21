# Estrutura do Banco de Dados - Supabase

Este documento detalha a estrutura do banco de dados PostgreSQL no Supabase para o Módulo de Comunicação.

## 1. Tabelas Principais

### 1.1. Autenticação e Usuários

#### `auth.users` (Gerenciada pelo Supabase Auth)
Tabela padrão do Supabase Auth para gerenciamento de usuários.

#### `profiles`
Armazena informações adicionais dos usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK, referência a auth.users.id |
| full_name | text | Nome completo do usuário |
| avatar_url | text | URL da imagem de perfil |
| job_title | text | Cargo do usuário |
| department_id | uuid | FK para departments.id |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |
| status | text | Status do usuário (ativo, inativo, ausente) |
| last_seen_at | timestamp | Última vez online |

#### `departments`
Departamentos da organização.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| name | text | Nome do departamento |
| description | text | Descrição do departamento |
| parent_id | uuid | FK para departments.id (hierarquia) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `teams`
Equipes que podem cruzar departamentos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| name | text | Nome da equipe |
| description | text | Descrição da equipe |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `team_members`
Associação entre usuários e equipes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| team_id | uuid | FK para teams.id |
| user_id | uuid | FK para auth.users.id |
| role | text | Papel do usuário na equipe |
| created_at | timestamp | Data de criação |

### 1.2. Canais de Comunicação

#### `channels`
Canais de comunicação configurados.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| name | text | Nome do canal |
| type | text | Tipo (whatsapp, facebook, instagram, email, sms, chat) |
| status | text | Status (ativo, inativo, em_teste) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `channel_configs`
Configurações específicas para cada canal.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| channel_id | uuid | FK para channels.id |
| config_key | text | Chave da configuração |
| config_value | text | Valor da configuração |
| is_secret | boolean | Se o valor deve ser tratado como segredo |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `channel_teams`
Associação entre canais e equipes responsáveis.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| channel_id | uuid | FK para channels.id |
| team_id | uuid | FK para teams.id |
| created_at | timestamp | Data de criação |

### 1.3. Conversas e Mensagens

#### `contacts`
Contatos/clientes com quem a comunicação ocorre.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| name | text | Nome do contato |
| email | text | Email do contato |
| phone | text | Telefone do contato |
| external_id | text | ID externo (em outras plataformas) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |
| last_contact | timestamp | Data do último contato |
| status | text | Status do contato |

#### `contact_channels`
Identificadores do contato em diferentes canais.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| contact_id | uuid | FK para contacts.id |
| channel_id | uuid | FK para channels.id |
| identifier | text | Identificador no canal (número, email, etc) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `conversations`
Conversas com contatos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| contact_id | uuid | FK para contacts.id |
| channel_id | uuid | FK para channels.id |
| status | text | Status (aberta, fechada, em_espera) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |
| closed_at | timestamp | Data de fechamento |
| assigned_to | uuid | FK para auth.users.id |
| last_message_at | timestamp | Data da última mensagem |
| subject | text | Assunto da conversa |

#### `messages`
Mensagens trocadas nas conversas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| conversation_id | uuid | FK para conversations.id |
| sender_type | text | Tipo do remetente (user, contact, bot, system) |
| sender_id | uuid | ID do remetente (depende do sender_type) |
| content | text | Conteúdo da mensagem |
| content_type | text | Tipo de conteúdo (text, image, audio, file, etc) |
| status | text | Status (enviada, entregue, lida) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |
| metadata | jsonb | Metadados adicionais |

#### `conversation_notes`
Notas internas sobre conversas (invisíveis ao cliente).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| conversation_id | uuid | FK para conversations.id |
| user_id | uuid | FK para auth.users.id |
| content | text | Conteúdo da nota |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `conversation_tags`
Tags aplicadas a conversas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| conversation_id | uuid | FK para conversations.id |
| tag_id | uuid | FK para tags.id |
| created_by | uuid | FK para auth.users.id |
| created_at | timestamp | Data de criação |

#### `tags`
Tags para categorização.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| name | text | Nome da tag |
| color | text | Cor da tag |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

### 1.4. CRM

#### `deals`
Oportunidades/negócios.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| contact_id | uuid | FK para contacts.id |
| title | text | Título da oportunidade |
| description | text | Descrição |
| value | numeric | Valor monetário |
| currency | text | Moeda |
| stage_id | uuid | FK para pipeline_stages.id |
| owner_id | uuid | FK para auth.users.id |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |
| expected_close_date | date | Data prevista para fechamento |
| closed_at | timestamp | Data de fechamento |
| status | text | Status (aberta, ganha, perdida) |
| source | text | Origem do negócio |

#### `pipelines`
Funis de vendas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| name | text | Nome do funil |
| description | text | Descrição |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |
| is_default | boolean | Se é o funil padrão |

#### `pipeline_stages`
Etapas dos funis.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| pipeline_id | uuid | FK para pipelines.id |
| name | text | Nome da etapa |
| description | text | Descrição |
| order | integer | Ordem no funil |
| probability | integer | Probabilidade de fechamento (%) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `deal_activities`
Atividades relacionadas a oportunidades.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| deal_id | uuid | FK para deals.id |
| user_id | uuid | FK para auth.users.id |
| activity_type | text | Tipo de atividade |
| description | text | Descrição |
| created_at | timestamp | Data de criação |
| scheduled_at | timestamp | Data agendada (se aplicável) |
| completed_at | timestamp | Data de conclusão |
| status | text | Status (pendente, completa, cancelada) |

### 1.5. Automações

#### `automations`
Regras de automação.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| name | text | Nome da automação |
| description | text | Descrição |
| trigger | text | Gatilho (nova_mensagem, inatividade, etc) |
| conditions | jsonb | Condições para execução |
| actions | jsonb | Ações a executar |
| status | text | Status (ativo, inativo) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `workflows`
Sequências de ações programadas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| name | text | Nome do workflow |
| description | text | Descrição |
| steps | jsonb | Passos do workflow |
| status | text | Status (ativo, inativo) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `workflow_executions`
Execuções de workflows.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| workflow_id | uuid | FK para workflows.id |
| entity_type | text | Tipo de entidade (contato, conversa, etc) |
| entity_id | uuid | ID da entidade |
| current_step | integer | Passo atual |
| status | text | Status (em_andamento, completo, falha) |
| started_at | timestamp | Data de início |
| completed_at | timestamp | Data de conclusão |
| data | jsonb | Dados relevantes |

### 1.6. Calendário

#### `events`
Eventos e compromissos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| title | text | Título do evento |
| description | text | Descrição |
| start_time | timestamp | Início |
| end_time | timestamp | Fim |
| all_day | boolean | Se dura o dia todo |
| location | text | Local |
| owner_id | uuid | FK para auth.users.id |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |
| status | text | Status (confirmado, cancelado, etc) |
| related_entity_type | text | Tipo de entidade relacionada |
| related_entity_id | uuid | ID da entidade relacionada |

#### `event_attendees`
Participantes de eventos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| event_id | uuid | FK para events.id |
| user_id | uuid | FK para auth.users.id |
| contact_id | uuid | FK para contacts.id (se externo) |
| status | text | Status (aceito, recusado, pendente) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `tasks`
Tarefas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| title | text | Título da tarefa |
| description | text | Descrição |
| due_date | timestamp | Data de vencimento |
| priority | text | Prioridade (baixa, média, alta) |
| owner_id | uuid | FK para auth.users.id |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |
| status | text | Status (pendente, completa, cancelada) |
| related_entity_type | text | Tipo de entidade relacionada |
| related_entity_id | uuid | ID da entidade relacionada |

### 1.7. Configurações

#### `business_hours`
Horários de funcionamento.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| day_of_week | integer | Dia da semana (0-6) |
| start_time | time | Hora de início |
| end_time | time | Hora de fim |
| is_workday | boolean | Se é dia útil |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `holidays`
Feriados.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| name | text | Nome do feriado |
| date | date | Data |
| recurring | boolean | Se repete anualmente |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `assignment_rules`
Regras de atribuição de conversas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |
| name | text | Nome da regra |
| description | text | Descrição |
| channel_id | uuid | FK para channels.id |
| rule_type | text | Tipo (round_robin, load_based, skill_based) |
| rule_config | jsonb | Configuração específica |
| team_id | uuid | FK para teams.id |
| priority | integer | Prioridade de aplicação |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |
| status | text | Status (ativo, inativo) |

## 2. Visões (Views)

### 2.1. `active_conversations`
Visão de conversas ativas com detalhes do contato e canal.

### 2.2. `unassigned_conversations`
Visão de conversas não atribuídas.

### 2.3. `user_performance`
Métricas de desempenho por usuário.

### 2.4. `pipeline_summary`
Resumo do status de oportunidades por funil e etapa.

## 3. Funções e Triggers

### 3.1. Funções

#### `assign_conversation(conversation_id uuid)`
Atribui uma conversa baseada nas regras configuradas.

#### `calculate_response_time(conversation_id uuid)`
Calcula tempo médio de resposta em uma conversa.

#### `update_deal_stage(deal_id uuid, stage_id uuid)`
Atualiza estágio de uma oportunidade com registro de histórico.

### 3.2. Triggers

#### `on_new_message`
Executa quando uma mensagem é criada, atualizando status de conversa e notificando usuários.

#### `on_conversation_status_change`
Registra mudanças de status em conversas.

#### `on_deal_update`
Registra atividades quando uma oportunidade é atualizada.

## 4. Políticas de Segurança RLS (Row Level Security)

### 4.1. Tabelas com RLS

- `profiles` - Usuários veem apenas seus próprios perfis, exceto administradores
- `conversations` - Usuários veem apenas conversas de suas equipes
- `messages` - Usuários veem apenas mensagens de conversas às quais têm acesso
- `deals` - Usuários veem apenas negócios atribuídos a eles ou suas equipes
- `events` - Usuários veem apenas eventos que criaram ou foram convidados

### 4.2. Exemplos de Políticas

```sql
-- Política para visualização de conversas
CREATE POLICY "Usuários veem apenas conversas de suas equipes" 
ON conversations FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM team_members 
    WHERE team_id IN (
      SELECT team_id FROM channel_teams 
      WHERE channel_id = conversations.channel_id
    )
  ) 
  OR conversations.assigned_to = auth.uid()
);

-- Política para edição de mensagens
CREATE POLICY "Usuários podem editar apenas suas próprias mensagens" 
ON messages FOR UPDATE 
USING (
  sender_type = 'user' AND sender_id = auth.uid() 
  AND created_at > now() - interval '5 minutes'
);
```

## 5. Índices

- `conversations_contact_id_idx` em `conversations(contact_id)`
- `conversations_assigned_to_idx` em `conversations(assigned_to)`
- `messages_conversation_id_created_at_idx` em `messages(conversation_id, created_at)`
- `contacts_email_idx` em `contacts(email)`
- `deals_stage_id_idx` em `deals(stage_id)`
- `events_start_time_idx` em `events(start_time)` 