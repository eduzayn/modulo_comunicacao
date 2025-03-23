# Estrutura de Configurações do Sistema

Este diretório contém todas as configurações gerais do sistema, organizadas por módulos e funcionalidades.

## Estrutura de Configurações

### Configurações Gerais

A pasta `/settings` contém configurações globais do sistema, incluindo:

- **Conta** (`/settings/account`) - Configurações de perfil e conta
- **Equipes** (`/settings/groups`) - Gerenciamento de usuários e permissões
- **Billing** (`/settings/billing`) - Faturamento e assinaturas
- **Integrações** (`/settings/integrations`) - Integrações com serviços externos
- E outras configurações transversais a múltiplos módulos

### Configurações Específicas de Módulos

Cada módulo também pode ter suas próprias configurações específicas:

- **Comunicação** (`/communication/settings`) - Configurações específicas do módulo de comunicação
- **CRM** (`/settings/crm`) - Configurações específicas de CRM
- **Inbox** (`/settings/inbox`) - Configurações da caixa de entrada unificada

## Diretrizes para Desenvolvimento

1. **Configurações Transversais vs. Específicas**:
   - Configurações que afetam múltiplos módulos devem ficar em `/settings/`
   - Configurações específicas de um único módulo podem ficar na pasta de configurações do próprio módulo

2. **Evitar Duplicação**:
   - Se uma configuração já existe em `/settings/`, não criar uma versão duplicada em módulos específicos
   - Referenciar configurações existentes em vez de duplicá-las

3. **Navegação**:
   - Manter links de navegação consistentes entre as diferentes áreas de configurações
   - Usar breadcrumbs para indicar a hierarquia

4. **Nomenclatura**:
   - Usar termos consistentes para configurações similares em diferentes módulos
   - Seguir o padrão estabelecido no layout de configurações principal

## Exemplos de Uso

### Adicionar nova seção de configurações:

1. Criar pasta em `/settings/nova-secao/`
2. Adicionar a rota na navegação lateral em `/settings/layout.tsx`
3. Criar a página com o formulário de configurações

### Adicionar configurações específicas de módulo:

1. Verificar se já não existe uma seção similar em `/settings/`
2. Se for realmente específico do módulo, criar em `/[modulo]/settings/`
3. Adicionar link para a configuração principal em `/settings/` 