# Fluxos de Dados - Módulo de Comunicação

Este documento detalha como os dados fluem entre os diferentes módulos do sistema e como as configurações afetam cada funcionalidade.

## 1. Fluxos de Dados Principais

### 1.1 Configurações → Inbox

#### Canais → Inbox
- **Dados**: Configurações de canais (tokens, credenciais, URLs de webhook)
- **Fluxo**: As configurações dos canais determinam quais plataformas (WhatsApp, Facebook, etc.) estão ativas
- **Impacto**: A inbox exibe apenas mensagens dos canais configurados e ativos

#### Equipes → Inbox
- **Dados**: Usuários, departamentos, permissões
- **Fluxo**: Configurações de equipe determinam quem pode visualizar e responder conversas
- **Impacto**: Filtros de conversas por departamento, visualização limitada por permissões

#### Regras de Atribuição → Inbox
- **Dados**: Critérios de distribuição (round-robin, carga, especialidade)
- **Fluxo**: Quando uma nova conversa chega, as regras determinam qual atendente receberá
- **Impacto**: Distribuição automática de conversas, balanceamento de carga

#### Horários Comerciais → Inbox
- **Dados**: Dias e horários de funcionamento, mensagens de fora do expediente
- **Fluxo**: Status de disponibilidade, respostas automáticas fora do horário
- **Impacto**: Etiquetas de "fora do expediente", mensagens automáticas

#### Tags → Inbox
- **Dados**: Categorias predefinidas para conversas
- **Fluxo**: Tags podem ser aplicadas manualmente ou por automações
- **Impacto**: Filtros de conversa, estatísticas por categoria

### 1.2 Inbox → CRM

#### Conversas → Contatos
- **Dados**: Histórico de mensagens, informações coletadas durante atendimento
- **Fluxo**: Informações da conversa alimentam perfil do contato
- **Impacto**: Atualizações de dados de contato, criação de novas oportunidades

#### Atendimentos → Leads
- **Dados**: Qualificações, interesses, necessidades identificadas
- **Fluxo**: Atendentes podem converter conversas em leads ou oportunidades
- **Impacto**: Movimentação no funil de vendas baseada em conversas

### 1.3 CRM → Calendário

#### Contatos/Oportunidades → Eventos
- **Dados**: Agendamentos, follow-ups, tarefas relacionadas a vendas
- **Fluxo**: Ao criar uma tarefa no CRM, ela é sincronizada com o calendário
- **Impacto**: Visualização unificada de compromissos relacionados a negócios

### 1.4 Configurações → CRM

#### Funis → Pipeline
- **Dados**: Etapas do processo de vendas, critérios de movimentação
- **Fluxo**: Configuração de funis define como os leads são processados
- **Impacto**: Estrutura visual do pipeline, métricas de conversão por etapa

#### Workflows → Automações de CRM
- **Dados**: Sequências de ações condicionais para nurturing
- **Fluxo**: Disparo de ações baseadas em eventos ou tempo
- **Impacto**: Movimentação automática de leads, disparos de emails/mensagens

## 2. Fluxos de Dados Detalhados por Cenário

### 2.1 Novo Atendimento via WhatsApp

1. **Canal WhatsApp → Inbox**
   - Webhook do WhatsApp envia nova mensagem
   - Sistema verifica configurações do canal (ativo/inativo)
   - Mensagem é recebida e registrada no banco de dados

2. **Regras de Atribuição → Distribuição**
   - Sistema verifica regras configuradas
   - Seleciona atendente conforme critérios (carga, especialidade)
   - Notifica atendente selecionado

3. **Atendente → Conversa**
   - Atendente visualiza dados do contato do CRM (se existir)
   - Responde ao cliente
   - Pode adicionar tags, notas internas

4. **Conversa → CRM**
   - Informações relevantes são extraídas (manualmente ou via IA)
   - Perfil do contato é atualizado ou criado
   - Oportunidade pode ser gerada

### 2.2 Gestão de Oportunidade

1. **CRM → Pipeline**
   - Oportunidade é criada (manualmente ou via conversa)
   - Inserida na primeira etapa do funil configurado
   - Valor, probabilidade e outros campos são preenchidos

2. **Workflow → Automações**
   - Trigger de "nova oportunidade" ativa workflow configurado
   - Sistema executa ações automáticas (email de boas-vindas, tarefas)

3. **CRM → Calendário**
   - Tarefas relacionadas à oportunidade são criadas
   - Eventos aparecem no calendário do responsável
   - Lembretes são configurados

4. **Oportunidade → Relatórios**
   - Métricas de conversão são atualizadas
   - Dados alimentam dashboards de vendas

### 2.3 Gestão de Bots

1. **Configurações de Bot → Atendimento**
   - Bot é configurado com fluxos de conversa e respostas
   - Condições de transferência para humano são definidas

2. **Canal → Bot → Inbox**
   - Mensagem chega e é interceptada pelo bot
   - Bot responde conforme fluxo configurado
   - Se necessário, transfere para atendente humano

3. **Bot → CRM**
   - Informações coletadas pelo bot (dados, preferências)
   - Alimentam o CRM automaticamente

## 3. Diagrama de Dependências de Dados

```
Configurações
  ├── Canais ────────────┐
  ├── Equipes ───────────┤
  ├── Horários ──────────┤
  ├── Regras de Atrib ───┤
  ├── Tags ──────────────┤
  ├── Bots ──────────────┤
  ├── Workflows ─────────┼───┐
  ├── Funis ─────────────┼───┤
  └── Automações ────────┘   │
                │            │
                ▼            │
              Inbox          │
                │            │
                ▼            ▼
               CRM ─────────► Calendário
                │
                ▼
            Relatórios
```

## 4. Implicações das Alterações de Configuração

### 4.1 Alteração de Canais
- **Impacto Imediato**: Disponibilidade de canais na inbox
- **Impacto Secundário**: Métricas segregadas por canal nos relatórios
- **Dependências**: Validação de credenciais, testes de conexão

### 4.2 Alteração de Equipes
- **Impacto Imediato**: Permissões de acesso, visibilidade de conversas
- **Impacto Secundário**: Redistribuição de conversas não atendidas
- **Dependências**: Notificações de nova estrutura, remapeamento de responsabilidades

### 4.3 Alteração de Funis
- **Impacto Imediato**: Estrutura visual do pipeline de vendas
- **Impacto Secundário**: Relatórios de conversão entre etapas
- **Dependências**: Migração de oportunidades existentes para nova estrutura

### 4.4 Alteração de Workflows
- **Impacto Imediato**: Sequências de ações automáticas
- **Impacto Secundário**: Experiência do cliente em jornadas automatizadas
- **Dependências**: Verificação de conflitos com outros workflows

## 5. Validações e Consistência de Dados

### 5.1 Validações ao Configurar Canais
- Credenciais válidas para APIs externas
- Formato correto de números/IDs
- Permissões necessárias concedidas

### 5.2 Validações ao Configurar Equipes
- Usuários com emails válidos
- Hierarquia consistente
- Evitar conflitos de permissão

### 5.3 Validações ao Configurar Automações
- Evitar loops infinitos
- Verificar condições de disparo
- Confirmar disponibilidade de recursos necessários

## 6. Sincronização de Dados

### 6.1 Sincronização Inbox-CRM
- Atualizações de perfil em tempo real
- Histórico de conversas vinculado ao contato
- Status de atendimento refletido em ambos os sistemas

### 6.2 Sincronização CRM-Calendário
- Tarefas criadas no CRM aparecem automaticamente no calendário
- Atualizações de status são bidirecionais
- Notificações entre sistemas

### 6.3 Sincronização com Canais Externos
- Confirmações de entrega/leitura são refletidas na inbox
- Status de mensagens sincronizado com plataformas externas
- Cache local para operação offline quando necessário 