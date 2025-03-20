# Arquitetura Feature-First

Este projeto adota uma arquitetura **feature-first**, que organiza o código em torno de funcionalidades de negócio em vez de tipos técnicos. Essa abordagem proporciona maior coesão, melhor manutenibilidade e mais fácil reuso de componentes.

## Estrutura de Diretórios

```
src/
  ├── features/          # Diretório principal para as features
  │   ├── chat/          # Feature de chat
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   ├── services/
  │   │   ├── types/
  │   │   └── index.ts   # Exportações centralizadas 
  │   │
  │   ├── crm/           # Feature de CRM
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   ├── services/
  │   │   ├── types/
  │   │   └── index.ts
  │   │
  │   ├── ai/            # Feature de Inteligência Artificial
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   ├── services/
  │   │   ├── types/
  │   │   └── index.ts
  │   │
  │   ├── settings/      # Feature de Configurações
  │   │   ├── components/
  │   │   │   ├── automations/
  │   │   │   ├── bots/
  │   │   │   └── ...
  │   │   ├── hooks/
  │   │   ├── services/
  │   │   ├── types/
  │   │   └── index.ts
  │   │
  │   └── shared/        # Componentes e hooks compartilhados entre features
  │
  ├── app/               # Rotas e páginas da aplicação (Next.js App Router)
  ├── components/        # Componentes globais da aplicação
  └── lib/               # Utilitários e bibliotecas compartilhadas
```

## Princípios da Arquitetura Feature-First

1. **Coesão Funcional**: Cada diretório de feature contém tudo necessário para aquela funcionalidade.
2. **Encapsulamento**: As implementações internas de uma feature são encapsuladas.
3. **API Pública Definida**: Cada feature expõe uma API clara através do arquivo `index.ts`.
4. **Independência**: Features são independentes umas das outras ou têm dependências claramente definidas.
5. **Relações entre Features**: Algumas features podem se relacionar com outras, como settings e inbox, mas essa relação é bem definida.

## Benefícios

- **Navegação Facilitada**: Desenvolvedores podem encontrar rapidamente todo o código relacionado a uma feature.
- **Colaboração Melhorada**: Equipes podem trabalhar em features separadas com menos conflitos.
- **Testabilidade**: Features são naturalmente mais isoladas, facilitando testes.
- **Crescimento Sustentável**: Novas features podem ser adicionadas sem causar caos no código existente.

## Features Implementadas

### Chat
Sistema de chat com suporte a diferentes tipos de mensagens e conversas. Veja a [documentação específica](./chat/README.md).

### CRM
Sistema de gerenciamento de contatos e negociações. Veja a [documentação específica](./crm/README.md).

### IA
Sistema de análise de mensagens e configuração de inteligência artificial. Veja a [documentação específica](./ai/README.md).

### Settings (Configurações)
Sistema para gerenciar configurações do sistema, incluindo automações, bots, e integrações. Veja a [documentação específica](./settings/README.md).

## Como Implementar uma Nova Feature

1. Crie um diretório para sua feature em `src/features/`
2. Estruture com subdiretorios: `components/`, `hooks/`, `services/`, `types/`
3. Implemente a lógica específica da feature em cada subdiretório
4. Crie um arquivo `index.ts` que exporta apenas o que deve ser público
5. Documente a feature em um arquivo `README.md`

## Interação entre Features

Algumas features podem interagir entre si:

1. **Settings → Inbox**: As configurações de canais são utilizadas pela caixa de entrada
2. **Settings → CRM**: As configurações de pipeline são utilizadas pelo CRM
3. **Settings → Chat**: As configurações de bots são utilizadas pelo chat

Essas interações são feitas através das APIs públicas de cada feature, garantindo o encapsulamento.

## Consumindo Features na Aplicação

```typescript
// Importação correta - use sempre o caminho de exportação principal
import { MeuComponente, useMinhaFeature } from '@/features/minha-feature';

// Evite importações diretas aos arquivos internos da feature
// ❌ import { MeuComponente } from '@/features/minha-feature/components/MeuComponente';
```

A arquitetura feature-first melhora significativamente a organização do código e a experiência de desenvolvimento em projetos de médio a grande porte, facilitando a manutenção e evolução do sistema. 