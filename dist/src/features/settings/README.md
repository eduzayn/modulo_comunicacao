# Feature: Settings (Configurações)

Esta feature implementa funcionalidades relacionadas às configurações do sistema, incluindo automações, bots, canais, pipelines, regras de atribuição e outras configurações específicas.

## Estrutura

A feature segue a arquitetura orientada a features, organizada da seguinte forma:

```
src/features/settings/
├── components/         # Componentes React da feature
│   ├── automations/    # Componentes de automações
│   │   └── AutomationForm.tsx
│   ├── bots/           # Componentes de bots
│   │   └── BotForm.tsx
│   └── ...             # Outros componentes específicos
├── hooks/              # Hooks React específicos da feature
│   └── use-settings.ts # Hook para gerenciar configurações
├── services/           # Serviços para comunicação com backend
│   └── settings-service.ts # Serviço para gerenciar configurações
├── types/              # Tipagens e interfaces
│   └── settings.types.ts # Interfaces e tipos
├── index.ts            # Exportações públicas da feature
└── README.md           # Esta documentação
```

## Componentes

### AutomationForm

Componente para criar e editar automações que executam ações baseadas em eventos.

```tsx
import { AutomationForm } from '@/features/settings'

<AutomationForm onSuccess={() => console.log('Automação criada!')} />
```

### BotForm

Componente para criar e editar bots para automatizar atendimentos em diferentes canais.

```tsx
import { BotForm } from '@/features/settings'

<BotForm onSuccess={() => console.log('Bot criado!')} />
```

## Hooks

### useBots

Hook para gerenciar os bots do sistema, permitindo listar, criar e alternar o status.

```tsx
import { useBots } from '@/features/settings'

const { 
  bots, 
  isLoading, 
  toggleBotStatus, 
  createBot 
} = useBots()
```

### useAutomations

Hook para gerenciar as automações do sistema, permitindo listar, criar e alternar o status.

```tsx
import { useAutomations } from '@/features/settings'

const { 
  automations, 
  isLoading, 
  toggleAutomationStatus, 
  createAutomation 
} = useAutomations()
```

### useChannels

Hook para gerenciar os canais de comunicação.

```tsx
import { useChannels } from '@/features/settings'

const { channels, isLoading } = useChannels()
```

### usePipelines

Hook para gerenciar os pipelines de funil de vendas.

```tsx
import { usePipelines } from '@/features/settings'

const { 
  pipelines, 
  isLoading, 
  createPipeline 
} = usePipelines()
```

## Serviços

### settings-service

Serviço que gerencia as operações de comunicação com o backend:

- Automações: `getAutomations`, `createAutomation`, `toggleAutomation`
- Bots: `getBots`, `createBot`, `toggleBot`
- Canais: `getChannels`
- Pipelines: `getPipelines`, `createPipeline`

## Tipos

A feature define os seguintes tipos principais:

- `Automation`: Representa uma automação para executar ações baseadas em eventos
- `Bot`: Representa um bot para automatizar atendimentos
- `Channel`: Representa um canal de comunicação
- `Pipeline`: Representa um funil de vendas com estágios
- `AssignmentRule`: Representa uma regra de atribuição
- `Course`: Representa um curso no sistema de LMS

## Relações com Outras Features

Esta feature de configurações está relacionada com outras partes do sistema:

1. **Caixa de Entrada (Inbox)**: As configurações de canais são utilizadas pela feature de caixa de entrada para determinar quais canais estão disponíveis para comunicação.

2. **CRM**: As configurações de pipeline são utilizadas pela feature de CRM para definir os estágios do funil de vendas.

3. **Chat**: As configurações de bots são utilizadas pela feature de chat para determinar quais bots estão disponíveis para atendimento automatizado.

## Exemplo de Uso

```tsx
import { BotForm, useBots } from '@/features/settings'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function BotsManagement() {
  const { bots, isLoading, toggleBotStatus } = useBots()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <h1>Gerenciamento de Bots</h1>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Novo Bot</Button>
        </DialogTrigger>
        <DialogContent>
          <BotForm onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>

      {bots.map(bot => (
        <div key={bot.id}>
          <h3>{bot.name}</h3>
          <p>Canal: {bot.channel}</p>
          <Button onClick={() => toggleBotStatus({ id: bot.id, enabled: !bot.enabled })}>
            {bot.enabled ? 'Desativar' : 'Ativar'}
          </Button>
        </div>
      ))}
    </div>
  )
} 