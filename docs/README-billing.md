# Módulo de Faturamento com Gateway Lytex Infinity Pay

Este documento descreve a implementação, configuração e uso do módulo de faturamento integrado com o gateway de pagamento Lytex Infinity Pay.

## Estrutura do Banco de Dados

O sistema utiliza diversas tabelas no Supabase:

1. **subscription_plans**: Planos de assinatura disponíveis
2. **subscriptions**: Assinaturas dos clientes
3. **payment_methods**: Métodos de pagamento salvos
4. **invoices**: Faturas geradas para assinaturas
5. **payment_history**: Histórico de pagamentos realizados
6. **billing_settings**: Configurações de faturamento dos clientes
7. **credits**: Créditos e descontos aplicados

## Como Executar as Migrações

Para criar as tabelas necessárias, execute o seguinte comando no CLI do Supabase:

```bash
# Acesse o painel do Supabase para o projeto
# Vá em SQL Editor e execute o conteúdo do arquivo migrations/01_billing_tables.sql
```

Alternativamente, você pode executar via linha de comando:

```bash
supabase db push migrations/01_billing_tables.sql
```

## Integração com Gateway Lytex Infinity Pay

A integração foi implementada através de:

1. **LytexGateway**: Classe de serviço para comunicação com a API Lytex
2. **Actions de Servidor**: Ações seguras para processar pagamentos
3. **Webhook**: Endpoint para receber notificações de status do gateway

### Configuração do Gateway

1. Configure as seguintes variáveis no arquivo `.env`:

```
NEXT_PUBLIC_LYTEX_API_KEY=sua_chave_publica
LYTEX_API_SECRET=sua_chave_secreta
```

2. Configure a URL do webhook no painel administrativo do Lytex:
```
https://seu-dominio.com/api/webhooks/lytex
```

## Métodos de Pagamento Suportados

1. **Cartão de Crédito**
   - Processamento direto com as principais bandeiras
   - Suporte a parcelamento
   - Salvamento de cartões para cobrança recorrente

2. **Boleto Bancário**
   - Geração de boletos com prazo configurável
   - Notificação automática quando pago

3. **PIX**
   - Geração de QR Code instantâneo
   - Validade configurável (padrão: 24h)
   - Conciliação automática quando pago

## Fluxo de Uso

### Criação de Assinatura

1. O cliente seleciona um plano
2. O sistema cria uma assinatura no banco de dados
3. O sistema gera uma fatura para o período atual
4. O cliente seleciona um método de pagamento
5. O sistema processa o pagamento via gateway
6. O sistema atualiza o status da fatura e assinatura

### Ciclo de Renovação

1. Um gatilho no banco detecta quando o período atual termina
2. O sistema gera automaticamente a nova fatura
3. Se o cliente tiver cartão salvo, o sistema tenta realizar o pagamento automático
4. Caso contrário, o cliente recebe notificação para realizar o pagamento
5. O sistema atualiza o status da fatura e assinatura

## Componentes do Sistema

1. **Hooks**
   - `useBilling` - Gerencia dados e ações de faturamento
   - `useSubscription` - Gerencia dados e ações de assinaturas
   - `useInvoices` - Gerencia dados e ações de faturas
   - `usePaymentMethods` - Gerencia dados e ações de métodos de pagamento

2. **Server Actions**
   - `processCardPayment` - Processa pagamentos com cartão
   - `generateBoleto` - Gera boletos para pagamento
   - `generatePix` - Gera QR code para pagamento PIX
   - `checkPaymentStatus` - Verifica status de transações
   - `requestRefund` - Solicita reembolso de transações

3. **Componentes de UI**
   - `PaymentMethodSelector` - Seleciona método de pagamento
   - `CreditCardForm` - Formulário para cartão de crédito
   - `BoletoForm` - Formulário para boleto
   - `PixPayment` - Exibe QR Code e instruções para PIX
   - `InvoicesList` - Lista faturas do cliente
   - `SubscriptionDetails` - Mostra detalhes da assinatura

## Tratamento de Erros

- Os erros de pagamento são capturados e exibidos ao usuário
- Códigos de erro específicos do gateway são mapeados para mensagens amigáveis
- Todos os erros são registrados para diagnóstico

## Segurança

- Toda a comunicação com o gateway é feita via server actions
- Dados sensíveis como chaves de API são armazenados apenas no servidor
- As políticas RLS garantem que usuários só vejam seus próprios dados
- Webhooks são validados por assinatura para evitar fraudes

## Métricas e Relatórios

O sistema armazena dados detalhados para geração de relatórios:

1. Receita total por período
2. Taxa de conversão por plano
3. Taxa de churn (cancelamentos)
4. Métodos de pagamento mais usados
5. Histórico de transações por cliente

## Considerações para Produção

1. **Certificação PCI-DSS**: Para processar cartões diretamente, considere a certificação PCI
2. **Notificações**: Implemente notificações por email/SMS para pagamentos e faturas
3. **Conciliação**: Implemente rotinas para conciliação bancária periódica
4. **Backup**: Configure backups regulares dos dados de pagamento
5. **Monitoramento**: Implemente alertas para falhas nas integrações

---

Desenvolvido pelo Time de Engenharia 