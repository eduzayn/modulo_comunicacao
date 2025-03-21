# Módulo de Comunicação - Documentação Técnica

Este documento centraliza as informações técnicas e diretrizes de desenvolvimento do Módulo de Comunicação, uma plataforma que unifica canais de comunicação e implementa recursos avançados de IA para otimizar o atendimento ao cliente.

## 1. Arquitetura Feature-First

O projeto segue uma **arquitetura feature-first**, que organiza o código em torno de funcionalidades de negócio.

### 1.1 Princípios Arquiteturais

1. **Coesão Funcional**: Cada feature contém tudo necessário para sua funcionalidade
2. **Encapsulamento**: Implementações internas são encapsuladas
3. **API Pública**: Features expõem APIs claras através de arquivos `index.ts`
4. **Independência**: Features são independentes ou têm dependências definidas

### 1.2 Estrutura Padrão de Features

Cada feature segue a estrutura:

```
feature/
  ├── components/      # Componentes React específicos da feature
  ├── hooks/           # Hooks React específicos da feature
  ├── services/        # Serviços e lógica de negócios
  ├── types/           # Tipagens específicas da feature
  ├── utils/           # Utilitários específicos da feature
  └── index.ts         # API pública da feature
```

### 1.3 Features Implementadas

- **chat**: Funcionalidade de chat e mensagens
- **crm**: Gestão de relacionamento com o cliente
- **settings**: Configurações da aplicação
- **ai**: Recursos de inteligência artificial
- **inbox**: Caixa de entrada unificada
- **contacts**: Gestão de contatos
- **conversations**: Gerenciamento de conversas
- **reports**: Relatórios e análises
- **calendar**: Agenda e compromissos

### 1.4 Estrutura Geral do Projeto

```
src/
  ├── app/               # Rotas e páginas da aplicação (Next.js App Router)
  │   ├── (auth)/        # Grupo de autenticação
  │   └── (dashboard)/   # Grupo de dashboard
  │
  ├── components/        # Componentes base da UI
  │   └── ui/            # Componentes de UI reutilizáveis (Shadcn UI)
  │
  ├── features/          # Diretório principal para as features
  │   ├── chat/          # Feature de chat
  │   ├── crm/           # Feature de CRM
  │   ├── ai/            # Feature de Inteligência Artificial
  │   └── settings/      # Feature de Configurações
  │
  ├── lib/               # Utilitários e bibliotecas compartilhadas
  │   └── supabase/      # Configuração do Supabase
  │
  ├── services/          # Proxy para serviços de features
  │
  └── types/             # Tipagens compartilhadas
```

## 2. Fluxos de Dados

### 2.1 Fluxos de Dados Principais

#### Configurações → Inbox
- **Canais**: Determinam quais plataformas estão ativas na inbox
- **Equipes**: Determinam quem pode visualizar e responder conversas
- **Regras de Atribuição**: Controlam a distribuição de conversas
- **Horários Comerciais**: Determinam respostas automáticas e status

#### Inbox → CRM
- **Conversas → Contatos**: Histórico de mensagens alimenta perfis
- **Atendimentos → Leads**: Conversas podem ser convertidas em oportunidades

#### CRM → Calendário
- **Contatos/Oportunidades → Eventos**: Tarefas criadas são sincronizadas

#### Configurações → CRM
- **Funis → Pipeline**: Estrutura de etapas de vendas
- **Workflows → Automações**: Disparadores de ações automáticas

### 2.2 Diagrama de Dependências de Dados

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

## 3. Layout e Design

### 3.1 Princípios de Design

- **Consistência**: Elementos de UI consistentes em todas as telas
- **Responsividade**: Layout adaptável a diferentes tamanhos de tela
- **Acessibilidade**: Compatível com WCAG 2.1 nível AA
- **Minimalismo**: Interface limpa, focada em usabilidade
- **Hierarquia**: Organização visual que prioriza elementos importantes

### 3.2 Estrutura de Layout

A estrutura base é composta por três colunas flexíveis:

```
┌───────────┬────────────────────────────┬───────────┐
│           │                            │           │
│  Sidebar  │       Área Principal       │  Painel   │
│  Lateral  │                            │  Lateral  │
│           │                            │           │
└───────────┴────────────────────────────┴───────────┘
```

Com adaptações responsivas:
- **Desktop (>1200px)**: Layout completo de três colunas
- **Tablet (768px-1199px)**: Sidebar lateral + Área principal (painel como overlay)
- **Mobile (<767px)**: Navegação inferior + Área principal (sidebars como overlay)

### 3.3 Paleta de Cores

- **Tema Claro (Padrão)**:
  - Fundo principal: `#FFFFFF`
  - Fundo secundário: `#F9FAFB`
  - Texto principal: `#111827`
  - Acentuação: `#2563EB`

- **Tema Escuro**:
  - Fundo principal: `#0F172A`
  - Fundo secundário: `#1E293B`
  - Texto principal: `#F1F5F9`
  - Acentuação: `#3B82F6`

### 3.4 Componentes de UI

O sistema utiliza a biblioteca Shadcn/UI e Tailwind CSS para componentes, incluindo:

- **Navegação**: Sidebar, menus, breadcrumbs
- **Data Display**: Tabelas, cards, listas, badges
- **Feedback**: Alerts, toasts, progress
- **Formulários**: Inputs, select, checkboxes, radio buttons
- **Layout**: Containers, grid, dividers
- **Overlay**: Modal, popover, drawer

## 4. Banco de Dados (Supabase)

### 4.1 Modelagem Principal

#### Autenticação e Usuários
- `auth.users`: Gerenciado pelo Supabase Auth
- `profiles`: Perfil estendido dos usuários
- `departments`: Departamentos da organização
- `teams`: Equipes que podem cruzar departamentos
- `team_members`: Associação entre usuários e equipes

#### Canais de Comunicação
- `channels`: Canais configurados (WhatsApp, Facebook, etc.)
- `channel_configs`: Configurações específicas de cada canal
- `channel_teams`: Equipes responsáveis por cada canal

#### Conversas e Mensagens
- `contacts`: Contatos/clientes
- `contact_channels`: Identificadores de contatos em diferentes canais
- `conversations`: Conversas com contatos
- `messages`: Mensagens trocadas nas conversas
- `conversation_notes`: Notas internas sobre conversas
- `conversation_tags`: Tags aplicadas a conversas
- `tags`: Tags para categorização

#### CRM
- `deals`: Oportunidades/negócios
- `pipelines`: Funis de vendas
- `pipeline_stages`: Etapas dos funis
- `deal_activities`: Atividades relacionadas a oportunidades

#### Automações
- `automations`: Regras de automação
- `workflows`: Sequências de ações programadas
- `workflow_executions`: Execuções de workflows

#### Calendário
- `events`: Eventos e compromissos
- `event_attendees`: Participantes de eventos
- `tasks`: Tarefas

#### Configurações
- `business_hours`: Horários de funcionamento
- `holidays`: Feriados
- `assignment_rules`: Regras de atribuição de conversas

### 4.2 Políticas de Segurança RLS

- `profiles`: Usuários veem apenas seus próprios perfis
- `conversations`: Usuários veem apenas conversas de suas equipes
- `messages`: Usuários veem apenas mensagens de conversas às quais têm acesso
- `deals`: Usuários veem apenas negócios atribuídos a eles ou suas equipes
- `events`: Usuários veem apenas eventos que criaram ou foram convidados

## 5. Integrações Externas

### 5.1 Integrações de Canais

- **WhatsApp Business API**: Mensagens WhatsApp
- **Facebook Messenger**: Chat do Facebook
- **Instagram Direct**: Mensagens do Instagram
- **Email (SMTP/IMAP)**: Emails via diversos provedores
- **SMS (Gateways)**: Mensagens SMS
- **Chat Web (Widget)**: Widget de chat para websites

### 5.2 APIs de Calendário

- **Google Calendar**: Integração com calendários Google
- **Microsoft Outlook**: Integração com calendários Microsoft

### 5.3 Integrações de Armazenamento

- **AWS S3**: Armazenamento de arquivos e anexos
- **Google Cloud Storage**: Alternativa para armazenamento

### 5.4 Integrações de Telefonia

- **VoIP (SIP/WebRTC)**: Chamadas de voz via navegador

### 5.5 API Pública do Sistema

O sistema oferece uma API RESTful para integração com sistemas externos, com endpoints para conversas, mensagens, contatos e canais.

## 6. Tecnologias Principais

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática para desenvolvimento seguro
- **Supabase**: Backend como serviço (Banco de dados e autenticação)
- **TanStack Query**: Gerenciamento de estado e dados
- **Shadcn UI + Tailwind CSS**: UI e estilização
- **Vercel AI SDK**: Integrações com IA

## 7. Diretrizes de Implementação

### 7.1 Padrões de Código

- **Padrão React**:
  - Componentes funcionais com hooks
  - Server components para dados, client components para interatividade
  - Suspense para carregamento
  - Props tipadas com TypeScript

- **Estilização**:
  - Tailwind CSS para todo estilo
  - Componentes Shadcn/UI como base
  - Mobile-first para responsividade
  - Variáveis CSS para temas

- **Gerenciamento de Estado**:
  - TanStack Query para estado do servidor
  - useState/useReducer para estado local
  - React Context para estado compartilhado
  - Server Actions para mutações

### 7.2 Implementação de Features

1. **Mantenha as dependências explícitas**: Ao depender de outra feature, importe apenas via API pública (index.ts)
2. **Evite dependências circulares**: Se duas features dependem uma da outra, extraia a funcionalidade comum
3. **Use tipos compartilhados**: Tipos comuns ficam em `src/types/`
4. **Teste por feature**: Os testes devem seguir a mesma estrutura das features
5. **Implemente progressivamente**: Comece com o núcleo da feature e adicione funcionalidades incrementalmente
6. **Documente APIs públicas**: Toda função ou componente exportado deve ser documentado

### 7.3 Implementação de UI

1. **Acessibilidade primeiro**: Garanta que todos os componentes sejam acessíveis
2. **Performance**: Minimize renderizações desnecessárias
3. **Consistência visual**: Siga o design system definido
4. **Responsividade**: Teste em múltiplos dispositivos e tamanhos
5. **Progressão de estados**: Considere todos os estados (vazio, carregando, erro, sucesso)

## 8. Fluxos Principais

### 8.1 Fluxo de Atendimento
1. Cliente envia mensagem via canal configurado
2. Mensagem chega na Inbox
3. Sistema aplica regras de atribuição
4. Atendente recebe e responde a conversa
5. Informações relevantes são registradas no CRM

### 8.2 Fluxo de Vendas
1. Lead é criado no CRM (manualmente ou via conversa)
2. Lead passa pelas etapas do funil configurado
3. Atividades são agendadas no Calendário
4. Automações e fluxos de trabalho auxiliam no processo
5. Métricas são registradas para Relatórios

## 9. Priorização de Desenvolvimento

1. Configurações básicas (Canais, Equipes, Permissões)
2. Inbox funcional (recebimento e envio de mensagens)
3. CRM básico (contatos, oportunidades, etapas)
4. Calendário (eventos, tarefas)
5. Relatórios (dashboards e métricas)
6. Automações (regras, bots, workflows)
7. Integrações avançadas e extensões 