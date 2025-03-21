# Arquitetura de Layouts

Este documento descreve a arquitetura de layouts utilizada no Módulo de Comunicação, incluindo a hierarquia de layouts, responsabilidades de cada componente e convenções adotadas.

## Visão Geral

A aplicação utiliza o sistema de layouts aninhados do Next.js App Router, permitindo:
- Compartilhamento de UI entre múltiplas rotas
- Redução de re-renderizações desnecessárias
- Organização de código por contexto funcional

```
RootLayout
├── Providers
│   ├── ThemeProvider
│   ├── QueryProvider (TanStack Query)
│   ├── AuthProvider
│   └── ActivityProvider
│
├── (communication)/layout.tsx
│   └── páginas da área de comunicação
│
└── admin/layout.tsx
    └── páginas da área administrativa
```

## Hierarquia de Layouts

### 1. RootLayout (`src/app/layout.tsx`)

**Responsabilidade**: Layout raiz que envolve toda a aplicação.

**Características**:
- Define a estrutura HTML base (`<html>`, `<body>`)
- Importa estilos globais
- Define metadados básicos da aplicação
- Suporte a múltiplos idiomas
- Envolve o componente `Providers`

### 2. Providers (`src/app/providers.tsx`)

**Responsabilidade**: Gerenciar todos os provedores de contexto da aplicação.

**Características**:
- ThemeProvider: gerenciamento de tema (claro/escuro)
- QueryProvider: configuração do TanStack Query para estado global
- AuthProvider: gerenciamento de autenticação e permissões
- ActivityProvider: monitoramento de atividades do usuário
- Toaster: sistema de notificações toast

### 3. CommunicationLayout (`src/app/(communication)/layout.tsx`)

**Responsabilidade**: Layout específico para a área de comunicação.

**Características**:
- Navegação lateral para módulos de comunicação
- Cabeçalho com informações do usuário
- Breadcrumbs para navegação
- Proteção de rota baseada em permissões
- Indicador de atividade

### 4. AdminLayout (`src/app/admin/layout.tsx`)

**Responsabilidade**: Layout específico para a área administrativa.

**Características**:
- Navegação lateral para funcionalidades de administração
- Proteção de rota (acesso restrito a administradores)
- Breadcrumbs para navegação
- Indicador de atividade
- Navegação mobile adaptativa

## Componentes Comuns de Layout

### NavMenu (`src/components/layout/NavMenu.tsx`)

**Responsabilidade**: Componente reutilizável para menus de navegação.

**Características**:
- Suporte a grupos de navegação aninhados
- Indicação visual do item ativo
- Ícones para cada item
- Versões desktop e mobile
- Animações de expansão/colapso

### Breadcrumbs (`src/components/layout/Breadcrumbs.tsx`)

**Responsabilidade**: Exibir o caminho de navegação atual.

**Características**:
- Geração automática baseada na rota atual
- Links para navegação rápida
- Truncamento inteligente para rotas longas
- Responsivo para diferentes tamanhos de tela

### ActivityIndicator (`src/components/layout/ActivityIndicator.tsx`)

**Responsabilidade**: Exibir indicador de atividades recentes.

**Características**:
- Exibição de atividades em tempo real
- Animações de entrada/saída
- Posicionamento fixo na interface
- Contador de novas atividades

### ProtectedPage (`src/components/auth/ProtectedPage.tsx`)

**Responsabilidade**: Componente HOC para proteção de rotas.

**Características**:
- Verificação de autenticação
- Verificação de permissões específicas
- Redirecionamento para login quando necessário
- Exibição de mensagem de acesso negado quando aplicável

## Convenções de Layout

### Estrutura de Pastas

- `src/app/layout.tsx`: Layout raiz
- `src/app/providers.tsx`: Provedores de contexto
- `src/app/(communication)/layout.tsx`: Layout de comunicação (grupo de rotas)
- `src/app/admin/layout.tsx`: Layout administrativo

### Componentes de Layout

- `src/components/layout/`: Componentes reutilizáveis de layout
- `src/components/ui/`: Componentes de UI (botões, cards, etc.)
- `src/components/auth/`: Componentes relacionados à autenticação

### Convenções de Nomeação

- Arquivos de layout: `layout.tsx`
- Componentes de layout: PascalCase (ex: `NavMenu.tsx`)
- Grupos de rotas: em parênteses (ex: `(communication)`)

### Estilos

- Uso consistente de Tailwind CSS para estilos
- Uso de variáveis CSS para cores e espaçamentos
- Layout mobile-first (responsivo)
- Suporte a temas claro/escuro

## Considerações de Performance

- Server Components para layouts estáticos
- Client Components apenas quando necessário (interatividade)
- Lazy loading para componentes pesados
- Suspense para componentes que carregam dados
- Minimização de layouts profundamente aninhados

## Extendendo os Layouts

Ao criar um novo grupo de rotas ou área funcional:

1. Decida se é necessário um novo layout ou se pode usar um existente
2. Se precisar de um novo layout, crie-o no diretório correspondente da rota
3. Reutilize componentes de layout existentes quando possível
4. Mantenha consistência com os layouts existentes
5. Atualize esta documentação para refletir a nova estrutura

## Integração com Sistema de Autenticação

Os layouts trabalham em conjunto com o sistema de autenticação:

- Verificação de autenticação em layouts que requerem login
- Verificação de permissões específicas para áreas restritas
- Feedback visual para o usuário sobre seu status de autenticação
- Redirecionamento automático para página de login quando necessário 