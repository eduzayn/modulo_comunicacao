# Estrutura de Rotas do Sistema

## Módulos Principais

### Módulo de Comunicação (`/communication`)
- `/communication` - Dashboard de comunicação
- `/communication/messages` - Lista de mensagens
- `/communication/contacts` - Gerenciamento de contatos
- `/communication/chat` - Interface de chat

### Módulo de Estudantes (`/student`)
- `/student` - Dashboard de estudantes
- `/student/profile` - Perfil do estudante
- `/student/grades` - Notas e avaliações
- `/student/attendance` - Frequência

### Módulo de Conteúdo (`/content`)
- `/content` - Dashboard de conteúdo
- `/content/courses` - Gerenciamento de cursos
- `/content/lessons` - Gerenciamento de aulas
- `/content/materials` - Materiais didáticos

### Módulo de Matrículas (`/enrollment`)
- `/enrollment` - Dashboard de matrículas
- `/enrollment/new` - Nova matrícula
- `/enrollment/history` - Histórico de matrículas
- `/enrollment/reports` - Relatórios

## Rotas do Sistema

### Autenticação
- `/login` - Página de login
- `/logout` - Rota de logout
- `/forgot-password` - Recuperação de senha

### Configurações
- `/settings` - Configurações gerais
- `/settings/profile` - Configurações de perfil
- `/settings/notifications` - Configurações de notificações

### Ajuda e Suporte
- `/help` - Central de ajuda
- `/help/faq` - Perguntas frequentes
- `/help/support` - Suporte técnico

### Estatísticas
- `/stats` - Dashboard de estatísticas
- `/stats/reports` - Relatórios gerais
- `/stats/analytics` - Análise de dados

## Proteção de Rotas

Todas as rotas, exceto as seguintes, requerem autenticação:
- `/login`
- `/forgot-password`
- `/help/faq`

## Redirecionamentos

- `/messages` -> `/communication/messages`
- `/contacts` -> `/communication/contacts`

## Breadcrumbs

Os breadcrumbs são gerados automaticamente baseados na estrutura de rotas e nos títulos dos componentes de menu.

## Convenções de Nomenclatura

1. URLs em minúsculas
2. Usar hífen para separar palavras em URLs
3. Nomes descritivos e semânticos
4. Evitar URLs muito profundas (máximo 3 níveis)

## Responsividades

Todas as rotas são responsivas e adaptadas para:
- Desktop (> 1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px) 