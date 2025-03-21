# Interfaces e Integrações - Módulo de Comunicação

Este documento detalha as interfaces e integrações do sistema com plataformas externas.

## 1. Visão Geral das Integrações

O Módulo de Comunicação integra-se com diversos sistemas externos para oferecer uma experiência completa de comunicação multicanal:

- **Mensageria**: WhatsApp, Facebook Messenger, Instagram DM
- **Email**: Provedores SMTP/IMAP/POP3
- **SMS**: Gateways de mensagens
- **Chat Web**: Widget personalizado para websites
- **Calendário**: Google Calendar, Microsoft Outlook
- **Telefonia**: VoIP, gravação de chamadas
- **Armazenamento**: AWS S3, Google Cloud Storage

## 2. Integrações de Canais

### 2.1. WhatsApp Business API

**Tipo de Integração**: API Oficial da Meta (WhatsApp Business API)

**Recursos Utilizados**:
- Envio de mensagens de texto, imagens, áudio e documentos
- Recebimento de mensagens via webhook
- Templates de mensagem pré-aprovados
- Confirmação de leitura e status de entrega
- Botões interativos e listas

**Fluxo de Integração**:
1. Obtenção de credenciais via Meta Business Manager
2. Configuração de webhook para recebimento de mensagens
3. Verificação e aprovação do número de telefone
4. Solicitação e aprovação de templates de mensagem

**Limitações**:
- Necessidade de aprovação de templates para mensagens iniciadas pela empresa
- Janela de 24 horas para resposta livre após contato do cliente

### 2.2. Facebook Messenger

**Tipo de Integração**: Facebook Graph API

**Recursos Utilizados**:
- Envio e recebimento de mensagens de texto e mídia
- Quick replies (botões de resposta rápida)
- Webviews integrados
- Persistência de menu
- Handover Protocol (transferência de conversas)

**Fluxo de Integração**:
1. Criação de app no Facebook Developer Portal
2. Configuração de webhook
3. Obtenção de tokens de acesso da página
4. Submissão para revisão de permissões

### 2.3. Instagram Direct

**Tipo de Integração**: Instagram Messaging API

**Recursos Utilizados**:
- Mensagens de texto e mídia
- Respostas a stories
- Menções
- Quick replies

**Fluxo de Integração**:
1. Vinculação da conta Instagram a uma página Facebook
2. Configuração via Facebook Developer Portal
3. Utilização da Graph API para mensagens

### 2.4. Email

**Tipo de Integração**: SMTP/IMAP/POP3

**Recursos Utilizados**:
- Envio de emails via SMTP
- Recebimento via IMAP/POP3
- Monitoramento de caixas de entrada
- Processamento de anexos

**Provedores Suportados**:
- Gmail / Google Workspace
- Microsoft 365 / Exchange
- Servidores genéricos SMTP/IMAP

**Fluxo de Integração**:
1. Configuração de credenciais SMTP/IMAP
2. Autenticação OAuth 2.0 para Google/Microsoft
3. Configuração de polling para novos emails
4. Conversão de emails em formato de conversa

### 2.5. SMS

**Tipo de Integração**: APIs de gateway SMS

**Provedores Suportados**:
- Twilio
- Zenvia
- AWS SNS
- Provedores locais

**Recursos Utilizados**:
- Envio de SMS
- Recebimento via webhook
- Suporte a SMS bidirecional
- Status de entrega

**Fluxo de Integração**:
1. Obtenção de credenciais do provedor
2. Configuração de número de origem
3. Configuração de webhook para respostas
4. Mapeamento de números para contatos

### 2.6. Chat Web (Widget)

**Tipo de Integração**: Widget JavaScript personalizado

**Recursos Utilizados**:
- Chat em tempo real no site
- Transferência de arquivos
- Histórico de conversas
- Personalização visual
- Formulário pré-chat
- Chatbot integrado

**Fluxo de Integração**:
1. Geração de código JavaScript para o site
2. Personalização do widget nas configurações
3. Instalação do código no site cliente
4. Configuração de notificações e roteamento

## 3. APIs de Calendário

### 3.1. Google Calendar

**Tipo de Integração**: Google Calendar API

**Recursos Utilizados**:
- Criação e atualização de eventos
- Sincronização bidirecional
- Convites para eventos
- Lembretes
- Disponibilidade

**Fluxo de Integração**:
1. Autenticação OAuth 2.0
2. Permissões de acesso ao calendário
3. Webhook para atualizações em tempo real
4. Mapeamento de eventos com CRM

### 3.2. Microsoft Outlook

**Tipo de Integração**: Microsoft Graph API

**Recursos Utilizados**:
- Gerenciamento de eventos
- Sincronização bidirecional
- Disponibilidade
- Convites

**Fluxo de Integração**:
1. Registro no Azure AD
2. Autenticação OAuth 2.0
3. Configuração de permissões
4. Sincronização periódica

## 4. Integrações de Armazenamento

### 4.1. AWS S3

**Tipo de Integração**: AWS SDK

**Recursos Utilizados**:
- Armazenamento de arquivos (anexos, gravações, backups)
- Geração de URLs temporários para acesso
- Políticas de retenção

**Fluxo de Integração**:
1. Configuração de bucket e credenciais
2. Implementação de upload seguro
3. Configuração de lifecycle policies

### 4.2. Google Cloud Storage

**Alternativa para armazenamento com funcionalidades similares à AWS S3**

## 5. Integrações de Telefonia

### 5.1. VoIP

**Tipo de Integração**: SIP/WebRTC

**Provedores Suportados**:
- Twilio
- Plivo
- Provedores SIP genéricos

**Recursos Utilizados**:
- Chamadas de voz via navegador
- Gravação de chamadas
- Transferência de chamadas
- IVR (Resposta Interativa de Voz)

**Fluxo de Integração**:
1. Configuração de credenciais do provedor
2. Implementação de cliente WebRTC
3. Configuração de webhook para eventos de chamada
4. Configuração de roteamento e filas

## 6. API Pública do Sistema

O Módulo de Comunicação oferece sua própria API RESTful para integração com sistemas externos:

### 6.1. Endpoints Principais

#### Conversas

```
GET /api/v1/conversations
POST /api/v1/conversations
GET /api/v1/conversations/{id}
PUT /api/v1/conversations/{id}
```

#### Mensagens

```
GET /api/v1/conversations/{id}/messages
POST /api/v1/conversations/{id}/messages
PUT /api/v1/messages/{id}
```

#### Contatos

```
GET /api/v1/contacts
POST /api/v1/contacts
GET /api/v1/contacts/{id}
PUT /api/v1/contacts/{id}
```

#### Canais

```
GET /api/v1/channels
GET /api/v1/channels/{id}/status
```

#### Webhooks

```
POST /api/v1/webhooks/register
DELETE /api/v1/webhooks/{id}
```

### 6.2. Autenticação da API

A API utiliza autenticação via tokens JWT:

1. **Obtenção de Token**:
   ```
   POST /api/v1/auth/token
   ```

2. **Renovação de Token**:
   ```
   POST /api/v1/auth/refresh
   ```

3. **Revogação de Token**:
   ```
   POST /api/v1/auth/revoke
   ```

Todos os endpoints requerem um token válido enviado no header `Authorization: Bearer {token}`.

### 6.3. Rate Limiting

- Limite padrão: 100 requisições por minuto por chave de API
- Endpoints de mensagens: 300 requisições por minuto
- Headers de resposta incluem informações de limite: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### 6.4. Webhooks

O sistema permite a configuração de webhooks para notificação em tempo real de eventos:

- Nova mensagem recebida
- Status de conversa alterado
- Conversa atribuída
- Mensagem entregue/lida

Formato da mensagem de webhook:
```json
{
  "event": "message.received",
  "timestamp": "2023-06-28T15:30:45Z",
  "data": {
    "conversation_id": "uuid",
    "message_id": "uuid",
    "sender": {
      "type": "contact",
      "id": "uuid"
    },
    "content": "...",
    "channel": "whatsapp"
  }
}
```

## 7. Segurança nas Integrações

### 7.1. Armazenamento de Credenciais

- Credenciais são armazenadas criptografadas no banco de dados
- Chaves sensíveis são mascaradas na interface
- Uso de vault para segredos (opcional)

### 7.2. Verificação de Webhook

- Assinatura de payload para verificar autenticidade
- Tokens de verificação para callbacks
- Validação de IP de origem (opcional)

### 7.3. Conformidade com LGPD/GDPR

- Expiração automática de dados conforme políticas
- Anonimização de dados sensíveis quando necessário
- Registros de consentimento para comunicações

## 8. Fluxo de Dados em Integrações

### 8.1. Recebimento de Mensagem (WhatsApp → Sistema)

1. Mensagem enviada pelo cliente via WhatsApp
2. Meta envia webhook para o endpoint configurado
3. Sistema valida assinatura do webhook
4. Mensagem é processada e convertida para formato interno
5. Sistema identifica contato ou cria novo
6. Mensagem é associada à conversa existente ou nova
7. Sistema aplica regras de atribuição
8. Notificações são enviadas para atendentes
9. Mensagem é exibida na interface

### 8.2. Envio de Mensagem (Sistema → WhatsApp)

1. Atendente compõe mensagem na interface
2. Sistema formata mensagem conforme API do WhatsApp
3. Requisição enviada para API do WhatsApp
4. Sistema recebe confirmação de envio
5. Status "enviado" é atualizado
6. Sistema aguarda confirmações de entrega/leitura
7. Status são atualizados conforme webhooks recebidos

### 8.3. Integração com Calendário (Agendamento)

1. Atendente cria evento associado a um contato/conversa
2. Sistema formata dados conforme API do Google Calendar
3. Evento é criado via API
4. Sistema recebe ID e link do evento
5. Evento é associado a contato/oportunidade
6. Sistema monitora atualizações/confirmações
7. Notificações são enviadas para lembretes

## 9. Monitoramento de Integrações

### 9.1. Painel de Status

O sistema fornece um painel de monitoramento de integrações com:
- Status de conexão para cada canal
- Taxas de sucesso de envio/recebimento
- Erros recentes
- Uso de API (quotas)

### 9.2. Alertas

Configuração de alertas para:
- Falhas de conexão
- Erros de autenticação
- Taxa elevada de falhas de entrega
- Aproximação de limites de API

### 9.3. Logs

- Logs detalhados de todas as chamadas de API
- Histórico de falhas com detalhes
- Rastreamento de mensagens por ID
- Tempo de resposta de integrações 