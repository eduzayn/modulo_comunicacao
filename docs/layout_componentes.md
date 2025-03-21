# Layout e Componentes - Módulo de Comunicação

Este documento detalha a estrutura de layout e os componentes principais do sistema.

## 1. Princípios de Design

O sistema segue os seguintes princípios de design:

- **Consistência**: Elementos de UI consistentes em todas as telas
- **Responsividade**: Layout adaptável a diferentes tamanhos de tela
- **Acessibilidade**: Compatível com WCAG 2.1 nível AA
- **Minimalismo**: Interface limpa, focada em usabilidade
- **Hierarquia**: Organização visual que prioriza elementos importantes

## 2. Layout Base

### 2.1. Estrutura Geral

O layout base do sistema segue uma estrutura de três colunas flexíveis:

```
┌───────────┬────────────────────────────┬───────────┐
│           │                            │           │
│           │                            │           │
│  Sidebar  │       Área Principal       │  Painel   │
│  Lateral  │                            │  Lateral  │
│           │                            │           │
│           │                            │           │
└───────────┴────────────────────────────┴───────────┘
```

#### Sidebar Lateral (à esquerda)
- Navegação principal
- Logotipo
- Menu de módulos
- Atalhos principais
- Avatar/perfil do usuário

#### Área Principal (centro)
- Conteúdo específico de cada página
- Listas, tabelas, formulários
- Área de trabalho principal

#### Painel Lateral (à direita)
- Detalhes contextuais
- Informações complementares
- Ações secundárias
- Pode ser recolhido/expandido

### 2.2. Responsividade

O layout se adapta a diferentes tamanhos de tela:

- **Desktop (>1200px)**: Layout completo de três colunas
- **Tablet (768px-1199px)**: Sidebar lateral esquerda + Área principal (painel lateral como overlay)
- **Mobile (<767px)**: Navegação inferior + Área principal (sidebars como overlay)

## 3. Componentes Principais

### 3.1. Navegação

#### 3.1.1. Sidebar Principal
```
┌─────────────────────┐
│      [LOGO]         │
├─────────────────────┤
│ ● Inbox             │
│ ○ CRM               │
│ ○ Calendário        │
│ ○ Relatórios        │
│ ○ Configurações     │
├─────────────────────┤
│     Filtros         │
├─────────────────────┤
│ [Avatar] Nome       │
│ Status: Online ▼    │
└─────────────────────┘
```

#### 3.1.2. Barra de Navegação Secundária
Aparece no topo da área principal, contextual ao módulo selecionado:

```
┌─────────────────────────────────────────────────────┐
│ Inbox > Conversas Abertas                      [⚙] │
├─────────────────────────────────────────────────────┤
│ [Buscar...]  [Filtros ▼]  [Ordenar ▼]  [+ Nova]    │
└─────────────────────────────────────────────────────┘
```

#### 3.1.3. Navegação Inferior (Mobile)
```
┌───────┬───────┬───────┬───────┬───────┐
│       │       │       │       │       │
│ Inbox │  CRM  │ Chat  │ Agenda│ Menu  │
│       │       │       │       │       │
└───────┴───────┴───────┴───────┴───────┘
```

### 3.2. Componentes de Lista

#### 3.2.1. Lista de Conversas
```
┌─────────────────────────────────────────┐
│ [Avatar] João Silva                 12:45│
│ WhatsApp ● Olá, gostaria de saber...    │
├─────────────────────────────────────────┤
│ [Avatar] Maria Oliveira              Ter │
│ Instagram ○ Estou interessada em...     │
├─────────────────────────────────────────┤
│ [Avatar] Carlos Santos               Seg │
│ Email ○ Solicito informações sobre...   │
└─────────────────────────────────────────┘
```

#### 3.2.2. Lista de Contatos
```
┌─────────────────────────────────────────┐
│ [Avatar] Ana Lima                    [⋮] │
│ ana.lima@email.com ● (11) 98765-4321    │
├─────────────────────────────────────────┤
│ [Avatar] Pedro Costa                 [⋮] │
│ pedro@empresa.com ● (21) 99876-5432     │
└─────────────────────────────────────────┘
```

#### 3.2.3. Pipeline (CRM)
```
┌────────────┬────────────┬────────────┬────────────┐
│  Contato   │ Qualificado│ Negociação │  Fechado   │
│  Inicial   │            │            │            │
├────────────┼────────────┼────────────┼────────────┤
│ [Card]     │ [Card]     │            │ [Card]     │
│ [Card]     │ [Card]     │ [Card]     │            │
│ [Card]     │            │ [Card]     │            │
└────────────┴────────────┴────────────┴────────────┘
```

### 3.3. Componentes de Conversa

#### 3.3.1. Chat
```
┌─────────────────────────────────────────────────────┐
│ [Avatar] Maria Oliveira                       [⋮]   │
│ WhatsApp ● Online agora                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│                      10:30                          │
│                                                     │
│ ┌─────────────────────────────┐                     │
│ │ Olá, como posso ajudar?     │                     │
│ │                             │                     │
│ └─────────────────────────────┘                     │
│                                                     │
│                     ┌───────────────────────────┐   │
│                     │ Gostaria de informações   │   │
│                     │ sobre o curso de inglês   │   │
│                     │                           │   │
│                     └───────────────────────────┘   │
│                                            10:32 ✓✓ │
│                                                     │
│ ┌─────────────────────────────────────────────┐     │
│ │ Claro! Temos diversos níveis disponíveis.   │     │
│ │ Qual seria seu interesse específico?        │     │
│ │                                             │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
├─────────────────────────────────────────────────────┤
│ [📎] [Digite sua mensagem...               ] [😊][➤]│
└─────────────────────────────────────────────────────┘
```

#### 3.3.2. Painel de Informações do Contato
```
┌─────────────────────────────┐
│ [Avatar]                    │
│ Maria Oliveira              │
│ Cliente desde: 10/06/2023   │
├─────────────────────────────┤
│ CONTATO                     │
│ 📱 (11) 98765-4321          │
│ ✉️ maria@email.com          │
├─────────────────────────────┤
│ TAGS                        │
│ [Novo Cliente] [Curso]      │
├─────────────────────────────┤
│ NOTAS                       │
│ [+ Adicionar nota]          │
│                             │
│ 20/06 - Interessada em...   │
│ 15/06 - Primeiro contato... │
├─────────────────────────────┤
│ OPORTUNIDADES               │
│ [+ Nova oportunidade]       │
│                             │
│ Curso de inglês - R$ 1.200  │
│ Em negociação               │
└─────────────────────────────┘
```

### 3.4. Componentes de Formulário

#### 3.4.1. Formulário de Contato
```
┌─────────────────────────────────────────────────────┐
│ NOVO CONTATO                                 [X]    │
├─────────────────────────────────────────────────────┤
│ Nome*                                               │
│ [                                              ]    │
│                                                     │
│ Email                      Telefone*                │
│ [                    ]     [                  ]     │
│                                                     │
│ Origem                                              │
│ [Website           ▼]                               │
│                                                     │
│ Observações                                         │
│ [                                              ]    │
│ [                                              ]    │
│                                                     │
│                               [Cancelar] [Salvar]   │
└─────────────────────────────────────────────────────┘
```

#### 3.4.2. Configuração de Canal
```
┌─────────────────────────────────────────────────────┐
│ CONFIGURAR WHATSAPP                         [X]     │
├─────────────────────────────────────────────────────┤
│ Nome do Canal*                                      │
│ [WhatsApp Vendas                               ]    │
│                                                     │
│ Número de Telefone*                                 │
│ [+55                                            ]   │
│                                                     │
│ Tipo de Integração                                  │
│ (●) WhatsApp Business API                           │
│ ( ) WhatsApp Cloud API                              │
│                                                     │
│ Token de Acesso*                                    │
│ [••••••••••••••••••••••••                      ]    │
│                                                     │
│ Webhook Verification Token*                         │
│ [                                              ]    │
│                                                     │
│ URL de Callback                                     │
│ [https://api.seudominio.com/webhook/whatsapp   ]    │
│                                                     │
│ Equipe Responsável                                  │
│ [Equipe de Vendas      ▼]                           │
│                                                     │
│                            [Cancelar] [Conectar]    │
└─────────────────────────────────────────────────────┘
```

### 3.5. Componentes de Dashboard

#### 3.5.1. Cartões de Estatísticas
```
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│                   │ │                   │ │                   │
│  Conversas Hoje   │ │  Tempo Resposta   │ │   Taxa Resolução  │
│                   │ │                   │ │                   │
│       127         │ │     4.5 min       │ │       87%         │
│   ↑ 12% vs ontem  │ │  ↓ 0.8 vs ontem   │ │   ↑ 3% vs ontem   │
│                   │ │                   │ │                   │
└───────────────────┘ └───────────────────┘ └───────────────────┘
```

#### 3.5.2. Gráfico de Atividade
```
┌───────────────────────────────────────────────────────────┐
│ VOLUME DE MENSAGENS                               [⋮]     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ 100 │                 ▄▄                                  │
│     │                ▄██▄    ▄▄                           │
│  75 │               ▄███▄   ▄██▄                          │
│     │              ▄████▄  ▄███▄   ▄                      │
│  50 │             ▄█████▄ ▄████▄  ▄█▄                     │
│     │    ▄       ▄██████▄▄█████▄ ▄██▄                     │
│  25 │   ▄█▄     ▄███████████████▄███▄                     │
│     │  ▄██▄    ▄████████████████████▄                     │
│   0 └─────────────────────────────────────────────────    │
│      Seg  Ter  Qua  Qui  Sex  Sáb  Dom                    │
│                                                           │
│      WhatsApp ──── Facebook ──── Instagram ────           │
└───────────────────────────────────────────────────────────┘
```

## 4. Temas e Variações

### 4.1. Tema Claro (Padrão)

- Fundo principal: `#ffffff`
- Fundo secundário: `#f9fafb`
- Texto primário: `#111827`
- Texto secundário: `#6b7280`
- Cor primária: `#2563eb`
- Cor de sucesso: `#10b981`
- Cor de alerta: `#f59e0b`
- Cor de erro: `#ef4444`

### 4.2. Tema Escuro

- Fundo principal: `#0f172a`
- Fundo secundário: `#1e293b`
- Texto primário: `#f1f5f9`
- Texto secundário: `#94a3b8`
- Cor primária: `#3b82f6`
- Cor de sucesso: `#34d399`
- Cor de alerta: `#fbbf24`
- Cor de erro: `#f87171`

## 5. Layout por Módulo

### 5.1. Módulo de Inbox

**Layout de três colunas:**
- Sidebar principal (esquerda) 
- Lista de conversas (coluna central esquerda)
- Chat ativo (coluna central direita)
- Painel de informações do contato (direita)

**Fluxo da tela:**
1. Seleção de conversa na lista
2. Visualização completa do histórico de mensagens
3. Resposta ou ações na conversa
4. Consulta de informações do contato no painel lateral

### 5.2. Módulo de CRM

**Layout principal:**
- Sidebar principal (esquerda)
- Lista de contatos/oportunidades ou visualização kanban
- Painel de detalhes (direita)

**Visualizações alternativas:**
- Kanban (pipeline)
- Lista
- Tabela
- Cartões

### 5.3. Módulo de Calendário

**Layout principal:**
- Sidebar principal (esquerda)
- Calendário mensal/semanal/diário
- Painel de detalhes do evento (direita)

**Visualizações alternativas:**
- Mês
- Semana
- Dia
- Agenda (lista)

### 5.4. Módulo de Configurações

**Layout duas colunas:**
- Sidebar principal (esquerda)
- Menu de configurações (coluna central esquerda)
- Área de configuração ativa (coluna central direita + direita)

## 6. Componentes Shadcn/UI Utilizados

O sistema utiliza a biblioteca Shadcn/UI para componentes base, incluindo:

### 6.1. Componentes de Interface
- Button
- Card
- Dialog
- Dropdown Menu
- Tabs
- Toast
- Tooltip
- Avatar
- Badge

### 6.2. Componentes de Formulário
- Input
- Textarea
- Select
- Combobox
- Checkbox
- Radio Group
- Switch
- Slider
- Date Picker

### 6.3. Componentes de Layout
- Sheet
- Accordion
- Collapsible
- Scroll Area
- Separator
- Resizable

### 6.4. Componentes de Dados
- Table
- Data Table
- Calendar
- Command

## 7. Estados e Feedback Visual

### 7.1. Estados de Elementos

- **Estado Padrão**: Apresentação normal do elemento
- **Estado Hover**: Quando o cursor está sobre o elemento
- **Estado Foco**: Quando o elemento recebe foco via teclado
- **Estado Ativo**: Quando o elemento está sendo clicado/pressionado
- **Estado Desabilitado**: Quando a interação não está disponível
- **Estado Carregando**: Durante operações assíncronas
- **Estado Erro**: Quando há problema com o elemento
- **Estado Sucesso**: Quando uma operação é concluída com sucesso

### 7.2. Feedback do Sistema

- **Toast Notifications**: Mensagens temporárias para feedback imediato
- **Diálogos de Confirmação**: Para ações destrutivas ou importantes
- **Indicadores de Progresso**: Para operações longas
- **Micro-interações**: Animações sutis para feedback de interação
- **Validação em Tempo Real**: Nos formulários, durante digitação

## 8. Acessibilidade

### 8.1. Recursos de Acessibilidade

- **Contraste Adequado**: WCAG 2.1 AA (mínimo 4.5:1)
- **Navegação por Teclado**: Todos os elementos interativos acessíveis
- **Etiquetas em Formulários**: Todos os campos com labels descritivos
- **Estados de Foco Visíveis**: Indicação clara do elemento em foco
- **Textos Alternativos**: Para imagens e ícones
- **Hierarquia de Cabeçalhos**: Estrutura semântica correta
- **Mensagens de Erro Claras**: Descrição objetiva dos problemas
- **Aria Attributes**: Implementação apropriada dos atributos ARIA

### 8.2. Testes de Acessibilidade

Todos os componentes são testados para:
- Navegação com teclado
- Compatibilidade com leitores de tela
- Contraste de cores
- Redimensionamento de texto até 200%

## 9. Responsividade

### 9.1. Breakpoints Principais

- **Mobile pequeno**: < 375px
- **Mobile**: 376px - 767px
- **Tablet**: 768px - 1023px
- **Desktop pequeno**: 1024px - 1279px
- **Desktop**: 1280px - 1535px
- **Desktop grande**: > 1536px

### 9.2. Variações para Mobile

- Navegação condensada na parte inferior
- Sobrepor painéis laterais em vez de mostrar lado a lado
- Botões de ação flutuantes
- Menus simplificados
- Gráficos e tabelas adaptados

## 10. Interações e Animações

### 10.1. Princípios de Animação

- **Sutileza**: Animações discretas para não distrair
- **Propósito**: Animações comunicam mudanças de estado
- **Consistência**: Padrões de animação consistentes
- **Performance**: Animações otimizadas para desempenho

### 10.2. Interações Comuns

- Transições suaves entre estados
- Feedback imediato para ações do usuário
- Carregamento progressivo de conteúdo
- Sinalização de novos itens
- Arrastar e soltar para reordenação
- Gestos de deslize no mobile 