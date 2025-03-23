# Resumo do Esquema do Banco de Dados

Este documento resume as principais tabelas e suas relações no sistema de comunicação. O banco de dados contém muitas tabelas, então este resumo foca nas mais relevantes para o módulo de comunicação.

## Tabelas Principais do Sistema de Comunicação

### Canais de Comunicação
- **channels**: Canais de comunicação suportados (WhatsApp, Telegram, etc.)
- **channel_integrations**: Integrações com os canais de comunicação
- **communication.widget_settings**: Configurações de widgets de comunicação
- **communication.widget_domains**: Domínios permitidos para widgets
- **communication.widget_form_fields**: Campos de formulário para widgets

### Conversas e Mensagens
- **conversations**: Conversas entre usuários ou clientes e equipe
- **messages**: Mensagens individuais dentro das conversas
- **chat_messages**: Mensagens de chat (possivelmente usado para chat interno)
- **chatbot_conversas**: Conversas com chatbots
- **chatbot_mensagens**: Mensagens de conversas com chatbots
- **chatbot_intents**: Intenções reconhecidas pelos chatbots

### Caixa de Entrada e Gerenciamento
- **inboxes**: Caixas de entrada para equipes
- **inbox_members**: Membros de uma equipe com acesso à caixa de entrada
- **templates**: Modelos de mensagens
- **canned_responses**: Respostas pré-definidas
- **tags**: Etiquetas para organização de conversas

### IA e Automação
- **ai_sessions**: Sessões de interação com IA
- **ai_messages**: Mensagens trocadas em sessões de IA
- **ai_prompts**: Templates de prompts para IA
- **ai_settings**: Configurações de IA
- **ai_assistance_history**: Histórico de assistência por IA
- **automations**: Automações para mensagens ou tarefas
- **assignment_rules**: Regras para atribuição automática de conversas
- **bots**: Bots configurados no sistema
- **workflows**: Fluxos de trabalho automatizados

### Contatos e CRM
- **contacts**: Contatos/clientes no sistema
- **deals**: Oportunidades de negócio
- **pipelines**: Funis de vendas
- **pipeline_cadences**: Cadências de follow-up

### Usuários e Permissões
- **users**: Usuários do sistema
- **profiles**: Perfis estendidos de usuários
- **user_profiles**: Informações adicionais de perfis
- **user_roles**: Funções dos usuários
- **permissions**: Permissões no sistema
- **teams**: Equipes
- **team_members**: Membros das equipes

### Configurações
- **admin_settings**: Configurações administrativas
- **email_settings**: Configurações de email
- **email_templates**: Modelos de email
- **auth_settings**: Configurações de autenticação
- **billing_settings**: Configurações de faturamento

## Observações sobre Segurança

Muitas das tabelas têm Row Level Security (RLS) habilitado, o que significa que o acesso aos dados é controlado por políticas no nível de linha. Isso fornece uma camada adicional de segurança, garantindo que os usuários só possam acessar os dados aos quais têm permissão.

## Tabelas específicas para educação

O banco de dados também contém várias tabelas relacionadas a educação, como `alunos`, `cursos`, `matriculas`, etc. Estas tabelas parecem ser para um sistema educacional ou de Learning Management System (LMS) e podem não estar diretamente relacionadas ao módulo de comunicação, mas podem ser integradas para comunicações específicas de educação.

## Tabelas de Personalização (White Label)

Várias tabelas com prefixo `white_label_` sugerem que o sistema suporta personalização de marca e aparência para diferentes organizações, permitindo que cada organização tenha sua própria identidade visual. 