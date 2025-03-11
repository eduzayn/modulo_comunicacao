# Verificação e Configuração do Banco de Dados

Este documento descreve a estrutura completa do banco de dados para o Módulo de Comunicação da Edunéxia, incluindo tabelas, buckets de armazenamento e outros componentes essenciais.

## Estrutura do Banco de Dados

### Tabelas Principais
| Tabela | Descrição | Registros |
|--------|-----------|-----------|
| `channels` | Canais de comunicação | 11 |
| `conversations` | Conversas | 7 |
| `messages` | Mensagens | 9 |
| `templates` | Templates de mensagens | 13 |
| `ai_settings` | Configurações de IA | 2 |

### Tabelas para Funcionalidades Avançadas
| Tabela | Descrição | Registros |
|--------|-----------|-----------|
| `webhooks` | Integrações externas | 0 |
| `queue_jobs` | Processamento assíncrono | 0 |
| `backups` | Sistema de backup | 0 |
| `email_templates` | Templates de email | 0 |
| `email_logs` | Logs de email | 0 |
| `metrics` | Métricas de desempenho | 0 |

## Buckets de Armazenamento
| Bucket | Descrição | Limite de Tamanho |
|--------|-----------|-------------------|
| `message_attachments` | Anexos de mensagens | 10MB |
| `template_attachments` | Anexos de templates | 5MB |
| `channel_assets` | Ativos de canais | 2MB |
| `backup_files` | Arquivos de backup | 50MB |

## Scripts de Verificação e Configuração

### Verificação do Banco de Dados
- `src/scripts/verify-database-complete.js` - Verifica a estrutura completa do banco

### Criação de Tabelas
- `src/scripts/create-missing-tables.js` - Cria tabelas avançadas faltantes

### Criação de Buckets
- `src/scripts/create-storage-buckets-with-env.js` - Cria buckets de armazenamento
- `src/scripts/create-backup-bucket.js` - Cria o bucket de backup com limite de tamanho ajustado

### Migrações
- `src/scripts/apply-missing-migrations.js` - Aplica migrações faltantes

## Configuração de Email

### Configurações SMTP
```
SMTP_HOST = "brasil.svrdedicado.org"
PORTA_SMTP = 587
SMTP_USER = contato@eduzayn.com.br
```

## Próximos Passos Recomendados
1. Adicionar dados iniciais às novas tabelas
2. Configurar webhooks para integrações externas
3. Configurar o sistema de email com os dados SMTP fornecidos
4. Implementar o processador de fila para tarefas assíncronas
5. Configurar o sistema de backup automático

## Verificação Final
A verificação final confirmou que todos os componentes necessários para o funcionamento integral do módulo de comunicação estão presentes e configurados corretamente.
