# Mapeamento do Sistema - Módulo de Comunicação

## 1. Visão Geral

O Módulo de Comunicação é um sistema completo para gerenciamento de comunicações multicanal (WhatsApp, Facebook, Instagram, Email, SMS, Chat) com foco em:

- Gerenciamento de conversas
- CRM
- Automações
- Relatórios
- Configurações avançadas

## 2. Arquitetura do Sistema

O sistema será desenvolvido com Next.js 14, utilizando:
- App Router com server components
- Shadcn UI para componentes
- Layout responsivo com Tailwind CSS
- Gerenciamento de estado com React Query
- Autenticação e armazenamento via Supabase

## 3. Estrutura de Diretórios

```
src/
  app/
    (auth)/
      login/
      forgot-password/
      reset-password/
    (dashboard)/
      layout.tsx (layout comum com sidebar)
      inbox/
      crm/
      calendar/
      reports/
      conversations/
      contacts/
      settings/
        account/
        channels/
        teams/
        business-hours/
        automations/
        bots/
        workflows/
        tags/
        billing/
  components/
    layout/
    inbox/
    crm/
    settings/
    ui/ (componentes shadcn)
  hooks/
  lib/
  services/
  types/
  utils/
```

## 4. Módulos do Sistema e Relações

### 4.1. Módulo de Inbox

**Função:** Gerenciar todas as conversas recebidas através dos diferentes canais configurados.

**Relações:**
- **Configurações > Canais**: Os canais configurados determinam as origens das conversas na inbox
- **Configurações > Equipes**: Define quem pode atender/visualizar conversas
- **Configurações > Regras de Atribuição**: Define como as conversas são distribuídas
- **Configurações > Horários Comerciais**: Determina disponibilidade de atendimento
- **CRM**: Cada conversa está associada a um contato/lead no CRM

### 4.2. Módulo de CRM

**Função:** Gerenciar contatos, leads, oportunidades e pipeline de vendas.

**Relações:**
- **Inbox**: Conversas associadas a cada contato
- **Configurações > Funis**: Define etapas do pipeline
- **Configurações > Automações**: Automações que podem mover leads entre etapas
- **Calendário**: Eventos/tarefas associados a cada contato

### 4.3. Módulo de Calendário

**Função:** Gerenciar agenda, compromissos e tarefas.

**Relações:**
- **CRM**: Tarefas e eventos associados a contatos/oportunidades
- **Configurações > Equipes**: Compartilhamento de calendário entre membros

### 4.4. Módulo de Relatórios

**Função:** Fornecer insights e métricas sobre atendimentos, vendas e desempenho.

**Relações:**
- **Inbox**: Métricas de atendimento (tempo, volume, satisfação)
- **CRM**: Métricas de vendas (conversão, valor, ciclo)
- **Configurações > Equipes**: Métricas por atendente/vendedor

### 4.5. Módulo de Configurações

**Função:** Centralizar todas as configurações do sistema.

#### 4.5.1. Canais
- Configuração de integrações com WhatsApp, Facebook, Instagram, Email, SMS, Chat
- **Impacta:** Inbox (origens de mensagens)

#### 4.5.2. Equipes
- Gerenciamento de usuários, permissões e departamentos
- **Impacta:** Inbox (atendimento), CRM (vendedores), Calendário (compartilhamento)

#### 4.5.3. Horários Comerciais
- Definição de dias/horários de funcionamento
- **Impacta:** Inbox (disponibilidade), Automações (respostas automáticas fora do horário)

#### 4.5.4. Automações
- Regras para automatizar tarefas repetitivas
- **Impacta:** Inbox (respostas automáticas), CRM (qualificação de leads)

#### 4.5.5. Bots
- Configuração de chatbots para atendimento inicial
- **Impacta:** Inbox (pré-atendimento)

#### 4.5.6. Fluxos de Trabalho
- Sequências de ações automatizadas
- **Impacta:** CRM (nurturing), Inbox (follow-ups)

#### 4.5.7. Tags
- Categorização de conversas e contatos
- **Impacta:** Inbox (filtros), CRM (segmentação)

#### 4.5.8. Regras de Atribuição
- Como as conversas são distribuídas entre os atendentes
- **Impacta:** Inbox (distribuição)

#### 4.5.9. Funis
- Etapas do processo de vendas
- **Impacta:** CRM (pipeline)

## 5. Fluxos Principais

### 5.1. Fluxo de Atendimento
1. Cliente envia mensagem via canal configurado (WhatsApp, Facebook, etc.)
2. Mensagem chega na Inbox
3. Sistema aplica regras de atribuição baseadas nas configurações
4. Atendente recebe e responde a conversa
5. Informações relevantes são registradas no CRM

### 5.2. Fluxo de Vendas
1. Lead é criado no CRM (manualmente ou via conversa na Inbox)
2. Lead passa pelas etapas do funil configurado
3. Atividades são agendadas no Calendário
4. Automações e fluxos de trabalho auxiliam no processo
5. Métricas são registradas para Relatórios

## 6. Banco de Dados (Supabase)

### Tabelas Principais:
- users
- profiles
- teams
- conversations
- messages
- contacts
- deals
- pipelines
- stages
- tasks
- events
- channels
- automations
- tags
- workflows

## 7. API e Integrações

- API do WhatsApp Business
- API do Facebook Messenger
- API do Instagram Direct
- Integração de Email (SMTP/IMAP)
- Gateway de SMS
- APIs de calendário (Google, Microsoft)

## 8. Interface de Usuário

- Design responsivo priorizando mobile-first
- Navegação intuitiva via sidebar principal
- Layout consistente entre módulos
- Componentes reutilizáveis com Shadcn UI
- Feedback visual imediato para ações do usuário

## 9. Segurança e Permissões

- Níveis de acesso: Admin, Gerente, Atendente, Vendedor
- Permissões granulares por módulo
- Autenticação via Supabase Auth
- Auditoria de ações importantes

## 10. Prioridades de Implementação

1. Estrutura base e autenticação
2. Módulo de Configurações (canais, equipes)
3. Inbox básica
4. CRM básico
5. Calendário
6. Relatórios
7. Funcionalidades avançadas de cada módulo 