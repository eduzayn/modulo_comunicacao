# Documento de Layout - Sistema de Comunicação

Este documento define o layout padrão para todos os módulos do sistema de comunicação, seguindo princípios de design minimalista, consistência visual e usabilidade.

## Estrutura Global

O sistema seguirá uma estrutura consistente em todos os módulos, com os seguintes elementos:

1. **Barra de Navegação Superior**: Contém o logotipo, botões de acesso aos módulos principais e perfil do usuário
2. **Sidebar Contextual**: Menu lateral específico para cada módulo
3. **Área de Conteúdo Principal**: Conteúdo específico de cada módulo/página
4. **Painéis Secundários**: Painéis laterais ou detalhes que podem ser expandidos/recolhidos

### Paleta de Cores

- **Principal**: Branco (#FFFFFF) - Fundo principal
- **Secundária**: Cinza claro (#F9FAFB) - Áreas de destaque, cards
- **Acentuação**: Azul (#2563EB) - Botões principais, links, elementos ativos
- **Texto Principal**: Cinza escuro (#111827) 
- **Texto Secundário**: Cinza médio (#6B7280)
- **Bordas**: Cinza muito claro (#E5E7EB)
- **Alerta**: Amarelo (#F59E0B)
- **Sucesso**: Verde (#10B981)
- **Erro**: Vermelho (#EF4444)

### Tipografia

- **Fonte Principal**: Inter (sans-serif)
- **Tamanhos**:
  - Títulos principais: 24px
  - Subtítulos: 18px
  - Texto regular: 14px
  - Texto pequeno: 12px
- **Pesos**:
  - Normal: 400
  - Médio: 500 
  - Negrito: 600

## 1. Módulo de Inbox (Caixa de Entrada Unificada)

O módulo de Inbox gerencia todas as conversas recebidas de diferentes canais (WhatsApp, Email, Instagram, Facebook, SMS, Widget).

### Layout da Tela

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Logo    [Inbox] [CRM] [Relatórios] [Configurações]       [Busca] [Perfil]│
├─────────┬───────────────────────────┬───────────────────────────────────┤
│         │                           │                                   │
│         │                           │                                   │
│ Filtros │    Lista de Conversas     │        Conversa Selecionada       │
│         │                           │                                   │
│ ● Todas │ ┌───────────────────────┐ │ ┌───────────────────────────────┐ │
│ ○ Não   │ │ [Avatar] Nome         │ │ │ [Avatar] Nome                 │ │
│   atrib.│ │ Canal • Prévia...     │ │ │ Canal • Status                │ │
│ ○ Minhas│ │                       │ │ ├───────────────────────────────┤ │
│         │ ├───────────────────────┤ │ │                               │ │
│ Status  │ │ [Avatar] Nome         │ │ │                               │ │
│ ○ Todas │ │ Canal • Prévia...     │ │ │       Histórico               │ │
│ ● Abert.│ │                       │ │ │          de                   │ │
│ ○ Resol.│ ├───────────────────────┤ │ │       Mensagens               │ │
│         │ │ [Avatar] Nome         │ │ │                               │ │
│ Canais  │ │ Canal • Prévia...     │ │ │                               │ │
│ ☑ Todos │ │                       │ │ │                               │ │
│ ☑ WA    │ ├───────────────────────┤ │ ├───────────────────────────────┤ │
│ ☑ Email │ │ [Avatar] Nome         │ │ │ [Campo de mensagem       ] [▶]│ │
│ ☐ FB    │ │ Canal • Prévia...     │ │ └───────────────────────────────┘ │
│ ☐ IG    │ │                       │ │         Painel de Detalhes       │
│         │ └───────────────────────┘ │ ┌───────────────────────────────┐ │
│         │    [Paginação]            │ │ Contato:                      │ │
│         │                           │ │ • Email: email@exemplo.com    │ │
│         │                           │ │ • Telefone: (00) 00000-0000   │ │
│         │                           │ │                               │ │
│         │                           │ │ Histórico:                    │ │
│         │                           │ │ • Atendimento: 3              │ │
│         │                           │ │ • Última interação: 01/06/23  │ │
│         │                           │ │                               │ │
│         │                           │ │ Notas:                        │ │
│         │                           │ │ [+ Adicionar nota]            │ │
│         │                           │ │                               │ │
│         │                           │ │ Tags:                         │ │
│         │                           │ │ [Novo] [Cliente] [Dúvida]     │ │
│         │                           │ └───────────────────────────────┘ │
└─────────┴───────────────────────────┴───────────────────────────────────┘
```

### Elementos Principais

1. **Lista de Conversas**
   - Item de conversa com avatar, nome, canal, prévia da mensagem e hora
   - Indicador de não lida (negrito)
   - Indicador de status (aberta, em espera, resolvida)
   - Ordenação por data/prioridade

2. **Área de Conversa**
   - Cabeçalho com informações do contato
   - Histórico de mensagens com formato de chat (bolhas)
   - Campo de resposta com opções de anexos, emojis
   - Indicadores de digitação, entrega e leitura

3. **Painel de Detalhes**
   - Informações do contato
   - Histórico de interações
   - Notas e tags
   - Acesso rápido ao CRM

4. **Filtros**
   - Por status
   - Por canal
   - Por atribuição
   - Por tags

### Responsividade

- **Desktop**: Layout completo (três colunas)
- **Tablet**: Lista + Conversa (painel de detalhes como overlay)
- **Mobile**: Visualização única (lista OU conversa) com navegação entre as views

## 2. Módulo de CRM

O módulo de CRM gerencia contatos, leads e oportunidades de vendas.

### Layout da Tela

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Logo    [Inbox] [CRM] [Relatórios] [Configurações]       [Busca] [Perfil]│
├─────────┬───────────────────────────────────────────────────────────────┤
│         │                                                               │
│ CRM     │ ┌───────────────────────────────────────────────────────────┐ │
│         │ │ Negociações                                  [+ Novo] [⚙] │ │
│ ● Negoc.│ ├───────────────────────────────────────────────────────────┤ │
│ ○ Taref.│ │ [Buscar]  [Filtros ▼]  [Ordenar ▼]    [Kanban] [Lista]    │ │
│ ○ Contat│ └───────────────────────────────────────────────────────────┘ │
│ ○ Campan│ │                                                           │ │
│         │ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │ │
│ Funis   │ │ │  CONTATO    │ │QUALIFICAÇÃO │ │ PROPOSTA    │ │FECHADO │ │ │
│ ● Padrão│ │ │  INICIAL    │ │             │ │             │ │        │ │ │
│ ○ Curso │ │ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├────────┤ │ │
│ ○ Serviç│ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │┌──────┐│ │ │
│         │ │ │ │Card Lead│ │ │ │Card Lead│ │ │ │Card Lead│ │ ││Card  ││ │ │
│ Etiqueta│ │ │ │R$1200   │ │ │ │R$850    │ │ │ │R$3000   │ │ ││R$2500││ │ │
│ ☑ Hot   │ │ │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │└──────┘│ │ │
│ ☐ Cold  │ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │             │ │        │ │ │
│ ☐ Novo  │ │ │ │Card Lead│ │ │ │Card Lead│ │ │             │ │        │ │ │
│         │ │ │ │R$500    │ │ │ │R$1500   │ │ │             │ │        │ │ │
│ Origem  │ │ │ └─────────┘ │ │ └─────────┘ │ │             │ │        │ │ │
│ ☑ Todos │ │ │ ┌─────────┐ │ │             │ │             │ │        │ │ │
│ ☑ Site  │ │ │ │Card Lead│ │ │             │ │             │ │        │ │ │
│ ☐ Email │ │ │ │R$750    │ │ │             │ │             │ │        │ │ │
│ ☐ Inbox │ │ │ └─────────┘ │ │             │ │             │ │        │ │ │
│         │ │ │             │ │             │ │             │ │        │ │ │
│         │ │ │  [+ Novo]   │ │  [+ Novo]   │ │  [+ Novo]   │ │[+ Novo]│ │ │
│         │ │ └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │ │
│         │ │                                                           │ │
└─────────┴───────────────────────────────────────────────────────────────┘
```

### Elementos Principais

1. **Pipeline (Kanban)**
   - Colunas para cada estágio do funil
   - Cards de oportunidades com informações essenciais
   - Drag-and-drop para mover entre estágios
   - Indicador de valor

2. **Lista de Oportunidades** (visualização alternativa)
   - Tabela com colunas configuráveis
   - Ordenação e filtros
   - Ações em lote

3. **Card de Oportunidade**
   - Título/nome do lead
   - Valor
   - Responsável
   - Data prevista de fechamento
   - Tags/etiquetas

4. **Filtros de CRM**
   - Por funil
   - Por estágio
   - Por responsável
   - Por origem
   - Por valor
   - Por etiquetas

### Visualizações Alternativas

- **Kanban** (padrão): Visualização de pipeline
- **Lista**: Visão em tabela com todas as oportunidades
- **Calendário**: Visualização de datas previstas de fechamento

## 3. Módulo de Relatórios

O módulo de relatórios oferece insights e métricas sobre atendimentos, vendas e desempenho.

### Layout da Tela

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Logo    [Inbox] [CRM] [Relatórios] [Configurações]       [Busca] [Perfil]│
├─────────┬───────────────────────────────────────────────────────────────┤
│         │                                                               │
│ Relat.  │ ┌───────────────────────────────────────────────────────────┐ │
│         │ │ Dashboard                                       [⚙] [⟳]  │ │
│ ● Dashb.│ ├───────────────────────────────────────────────────────────┤ │
│ ○ Visão │ │ Período: [Últimos 30 dias ▼]     [Exportar] [+ Adicionar] │ │
│ ○ Produt│ └───────────────────────────────────────────────────────────┘ │
│ ○ Atrib.│ │                                                           │ │
│ ○ Avalia│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │ │
│         │ │ │ Conversas   │ │ Tempo Médio │ │ Taxa de     │          │ │
│ Período │ │ │ Atendidas   │ │ de Resposta │ │ Resolução   │          │ │
│ ○ Hoje  │ │ │             │ │             │ │             │          │ │
│ ● 7 dias│ │ │    342      │ │   3.5 min   │ │    92%      │          │ │
│ ○ 30dias│ │ │ +12% vs ant.│ │ -8% vs ant. │ │ +2% vs ant. │          │ │
│ ○ Custom│ │ └─────────────┘ └─────────────┘ └─────────────┘          │ │
│         │ │                                                           │ │
│ Filtros │ │ ┌───────────────────────────────────────────────────────┐ │ │
│ ☑ Todos │ │ │ Volume de Mensagens por Canal                      [⋮] │ │ │
│ ☑ Atend.│ │ ├───────────────────────────────────────────────────────┤ │ │
│ ☐ Canais│ │ │                                                       │ │ │
│ ☐ CRM   │ │ │    ▄▄█▄▄                                              │ │ │
│         │ │ │   ▄█████▄    ▄▄                                       │ │ │
│ Canais  │ │ │  ▄███████▄  ▄██▄   ▄▄▄                               │ │ │
│ ☑ Todos │ │ │ ▄█████████▄▄████▄▄▄███▄▄                             │ │ │
│ ☑ WA    │ │ │                                                       │ │ │
│ ☐ Email │ │ │  Seg   Ter   Qua   Qui   Sex   Sáb   Dom              │ │ │
│ ☐ FB    │ │ │                                                       │ │ │
│ ☐ IG    │ │ │  WhatsApp —— Email —— Facebook —— Instagram           │ │ │
│         │ │ └───────────────────────────────────────────────────────┘ │ │
│         │ │                                                           │ │
│         │ │ ┌───────────────────────┐ ┌───────────────────────┐       │ │
│         │ │ │ Desempenho por Atend. │ │ Conversões por Etapa  │       │ │
│         │ │ ├───────────────────────┤ ├───────────────────────┤       │ │
│         │ │ │                       │ │                       │       │ │
│         │ │ │ 1. Ana    - 85 (98%)  │ │ Contato     ████ 75% │       │ │
│         │ │ │ 2. Carlos - 67 (95%)  │ │ Qualificação ███ 60% │       │ │
│         │ │ │ 3. Márcia - 54 (92%)  │ │ Proposta     ██ 45%  │       │ │
│         │ │ │ 4. João   - 48 (90%)  │ │ Fechamento   █ 25%   │       │ │
│         │ │ │                       │ │                       │       │ │
│         │ │ └───────────────────────┘ └───────────────────────┘       │ │
│         │ │                                                           │ │
└─────────┴───────────────────────────────────────────────────────────────┘
```

### Elementos Principais

1. **Cartões de Métricas**
   - Números principais destacados
   - Comparação com período anterior
   - Indicadores de tendência (up/down)

2. **Gráficos**
   - Séries temporais
   - Barras comparativas
   - Pizza/donut para distribuição
   - Funil para conversão

3. **Tabelas de Performance**
   - Rankings
   - Métricas comparativas
   - Tendências

4. **Filtros de Relatórios**
   - Por período
   - Por canal
   - Por atendente
   - Por segmento

### Dashboards Específicos

- **Visão Geral**: Principais métricas consolidadas
- **Produtividade**: Foco em desempenho de atendentes
- **Atribuição**: Distribuição e eficiência de atribuições
- **Avaliação**: Qualidade de atendimento e satisfação

## 4. Módulo de Configurações

O módulo de configurações gerencia todos os aspectos do sistema.

### Layout da Tela

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Logo    [Inbox] [CRM] [Relatórios] [Configurações]       [Busca] [Perfil]│
├─────────┬───────────────────────────────────────────────────────────────┤
│         │                                                               │
│ Config. │ ┌───────────────────────────────────────────────────────────┐ │
│         │ │ Configurações de Canais                                   │ │
│ Usuário │ ├───────────────────────────────────────────────────────────┤ │
│ ○ Perfil│ │                                             [+ Novo Canal]│ │
│ ○ Notif.│ │ ┌───────────────────────────────────────────────────────┐ │ │
│         │ │ │ Canais Ativos                                     [⚙] │ │ │
│ Ambiente│ │ ├───────────────────────────────────────────────────────┤ │ │
│ ○ Geral │ │ │ ┌─────────────────┐ ┌─────────────────┐              │ │ │
│ ○ Equipe│ │ │ │ [W] WhatsApp    │ │ [E] Email       │              │ │ │
│ ○ Permis│ │ │ │ Núm: +55981234..│ │ SMTP: smtp.emp..│              │ │ │
│ ○ Campos│ │ │ │ Status: Ativo   │ │ Status: Ativo   │              │ │ │
│         │ │ │ │ [Editar]        │ │ [Editar]        │              │ │ │
│ Canais  │ │ │ └─────────────────┘ └─────────────────┘              │ │ │
│ ● Canais│ │ │                                                       │ │ │
│ ○ Regras│ │ │ ┌─────────────────┐ ┌─────────────────┐              │ │ │
│ ○ Horár.│ │ │ │ [F] Facebook    │ │ [C] Chat Widget │              │ │ │
│ ○ Tags  │ │ │ │ Página: Empresa │ │ Site: empresa.co│              │ │ │
│         │ │ │ │ Status: Inativo │ │ Status: Ativo   │              │ │ │
│ CRM     │ │ │ │ [Editar]        │ │ [Editar]        │              │ │ │
│ ○ Funis │ │ │ └─────────────────┘ └─────────────────┘              │ │ │
│ ○ Campos│ │ └───────────────────────────────────────────────────────┘ │ │
│         │ │                                                           │ │
│ Automac.│ │ ┌───────────────────────────────────────────────────────┐ │ │
│ ○ Regras│ │ │ Configuração do WhatsApp                          [⚙] │ │ │
│ ○ Bots  │ │ ├───────────────────────────────────────────────────────┤ │ │
│ ○ Fluxos│ │ │                                                       │ │ │
│         │ │ │ Nome do Canal*                                        │ │ │
│ Relatór.│ │ │ [WhatsApp Vendas                                    ] │ │ │
│ ○ Dashb.│ │ │                                                       │ │ │
│ ○ Export│ │ │ Número de Telefone*                                   │ │ │
│         │ │ │ [+5511987654321                                     ] │ │ │
│ Integraç│ │ │                                                       │ │ │
│ ○ API   │ │ │ Tipo de Integração                                    │ │ │
│ ○ Widget│ │ │ (●) WhatsApp Business API                             │ │ │
│ ○ Backup│ │ │ ( ) WhatsApp Cloud API                                │ │ │
│         │ │ │                                                       │ │ │
│         │ │ │ Token de Acesso*                                      │ │ │
│         │ │ │ [•••••••••••••••••••••••••••••••••                  ] │ │ │
│         │ │ │                                                       │ │ │
│         │ │ │ Equipe Responsável                                    │ │ │
│         │ │ │ [Equipe de Vendas                                   ▼] │ │ │
│         │ │ │                                                       │ │ │
│         │ │ │ Webhook URL (Gerado pelo sistema)                     │ │ │
│         │ │ │ [https://api.empresa.com.br/webhook/whatsapp        ] │ │ │
│         │ │ │                                                       │ │ │
│         │ │ │                                  [Testar] [Salvar]    │ │ │
│         │ │ └───────────────────────────────────────────────────────┘ │ │
│         │ │                                                           │ │
└─────────┴───────────────────────────────────────────────────────────────┘
```

### Elementos Principais

1. **Menu de Configurações Categorizado**
   - Agrupamento lógico de configurações relacionadas
   - Navegação intuitiva
   - Indicadores visuais de configurações incompletas

2. **Cards de Canais**
   - Status visual (ativo/inativo)
   - Informações resumidas
   - Acesso rápido à edição

3. **Formulários de Configuração**
   - Campos claramente rotulados
   - Validação em tempo real
   - Ajuda contextual
   - Feedback claro de erros

4. **Painéis de Status**
   - Visão geral de integrações
   - Status de conexão
   - Alertas de problemas

### Categorias de Configurações

- **Usuário**: Perfil, notificações, preferências
- **Ambiente**: Equipe, permissões, campos personalizados
- **Canais**: Integrações de comunicação, regras de atribuição
- **CRM**: Funis, campos personalizados, etapas
- **Automações**: Regras, bots, fluxos de trabalho
- **Relatórios**: Dashboards personalizados, exportações
- **Integrações**: API, widget, backups

## Design Responsivo

### Adaptação para Diferentes Dispositivos

1. **Desktop (>1200px)**
   - Layout completo conforme diagramas
   - Visualização multipainel
   - Todas as funcionalidades disponíveis

2. **Tablet (768px-1199px)**
   - Sidebar colapsável
   - Painéis secundários como overlays
   - Layout ajustado para largura reduzida

3. **Mobile (<767px)**
   - Navegação simplificada
   - Visualização de um painel por vez
   - Botões de ação flutuantes
   - Menus como overlays

### Princípios de Responsividade

- Design mobile-first
- Breakpoints consistentes
- Preservação da funcionalidade
- Adaptação de elementos complexos (tabelas, gráficos)

## Componentes Comuns

### Botões
- **Primário**: Azul sólido, cantos levemente arredondados
- **Secundário**: Transparente com borda, mesmo formato
- **Terciário**: Apenas texto, sem borda
- **Perigo**: Vermelho, para ações destrutivas

### Formulários
- Campos com labels acima
- Feedback de validação inline
- Estados claros (foco, erro, sucesso)
- Agrupamento lógico

### Tabelas
- Cabeçalhos fixos
- Linhas com hover
- Paginação simplificada
- Opções de ordenação e filtro

### Modais
- Centralizado
- Overlay com desfoque
- Botão de fechar consistente
- Foco em conteúdo importante

## Implementação e Próximos Passos

Este documento servirá como referência para a reconstrução do sistema, garantindo consistência visual e funcional em todos os módulos.

1. Limpeza dos diretórios existentes
2. Implementação da estrutura base
3. Desenvolvimento dos componentes comuns
4. Implementação módulo a módulo
5. Testes de usabilidade e responsividade
6. Refinamentos com base no feedback 