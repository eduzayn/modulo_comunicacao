# Feature: CRM

Esta feature implementa funcionalidades de CRM (Customer Relationship Management) para o projeto, permitindo o gerenciamento de contatos e negociações.

## Estrutura

A feature segue a arquitetura orientada a features, organizada da seguinte forma:

```
src/features/crm/
├── components/            # Componentes React da feature
│   ├── CrmDashboard.tsx   # Dashboard principal que integra todos os componentes
│   ├── ContactList.tsx    # Lista de contatos com filtros e ações
│   └── DealList.tsx       # Lista de negociações de um contato
├── hooks/                 # Hooks React específicos da feature
│   ├── use-contacts.ts    # Hook para gerenciar contatos
│   └── use-deals.ts       # Hook para gerenciar negociações
├── services/              # Serviços para comunicação com backend
│   └── crm-service.ts     # Serviço para gerenciar contatos e negociações
├── types/                 # Tipagens e utilitários
│   └── crm.types.ts       # Interfaces e funções utilitárias
├── index.ts               # Exportações públicas da feature
└── README.md              # Documentação
```

## Componentes

### CrmDashboard

Componente principal que integra todos os componentes do CRM, organizados em abas para facilitar a navegação.

```tsx
<CrmDashboard userId="user-123" />
```

### ContactList

Componente para listar, filtrar e gerenciar contatos.

```tsx
<ContactList 
  initialFilters={{ type: 'Aluno' }}
  onSelectContact={(id) => console.log('Contato selecionado:', id)}
  onAddContact={() => console.log('Adicionar contato')}
  onEditContact={(id) => console.log('Editar contato:', id)}
  onDeleteContact={(id) => console.log('Contato excluído:', id)}
/>
```

### DealList

Componente para listar e gerenciar negociações de um contato específico.

```tsx
<DealList 
  contactId="contact-123"
  onAddDeal={() => console.log('Adicionar negociação')}
  onDeleteDeal={(id) => console.log('Negociação excluída:', id)}
/>
```

## Hooks

### useContacts

Hook que gerencia o estado e operações de contatos, incluindo:

- `fetchContacts`: Busca contatos com filtros
- `fetchContactById`: Busca um contato específico
- `addContact`: Adiciona um novo contato
- `editContact`: Atualiza um contato existente
- `removeContact`: Remove um contato
- `selectContact`: Seleciona um contato
- `updateFilters`: Atualiza os filtros

```tsx
const { 
  contacts,
  selectedContact,
  filters,
  isLoading,
  error,
  fetchContacts,
  fetchContactById,
  addContact,
  editContact,
  removeContact,
  selectContact,
  updateFilters
} = useContacts();
```

### useDeals

Hook que gerencia o estado e operações de negociações, incluindo:

- `fetchDealsByContact`: Busca negociações de um contato
- `initializeDeals`: Inicializa negociações para um contato
- `addDeal`: Adiciona uma nova negociação
- `changeDealStage`: Atualiza o estágio de uma negociação
- `removeDeal`: Remove uma negociação
- `selectDeal`: Seleciona uma negociação

```tsx
const { 
  deals,
  selectedDeal,
  isLoading,
  error,
  fetchDealsByContact,
  initializeDeals,
  addDeal,
  changeDealStage,
  removeDeal,
  selectDeal
} = useDeals('contact-123');
```

## Serviços

### crm-service

Serviço que gerencia as operações de comunicação com o backend, dividido em duas partes:

**Contatos**:
- `getContacts`: Busca contatos com filtros
- `getContactById`: Busca um contato específico
- `createContact`: Cria um novo contato
- `updateContact`: Atualiza um contato existente
- `deleteContact`: Remove um contato

**Negociações**:
- `createDeal`: Cria uma nova negociação
- `getDealsByContact`: Busca negociações de um contato
- `updateDealStage`: Atualiza o estágio de uma negociação
- `deleteDeal`: Remove uma negociação

## Tipos

A feature define os seguintes tipos principais:

- `Contact`: Representa um contato
- `ContactFormData`: Dados para criação/atualização de contato
- `ContactFilters`: Filtros para busca de contatos
- `ContactsState`: Estado global de contatos
- `Deal`: Representa uma negociação
- `CreateDealData`: Dados para criação de negociação
- `DealState`: Estado global de negociações
- `FunnelStage`: Estágios do funil de vendas

## Exemplo de Uso

```tsx
import { CrmDashboard } from '@/features/crm';

export default function CrmPage() {
  return (
    <div className="container mx-auto p-4">
      <CrmDashboard userId="user-123" />
    </div>
  );
}
```

## Configuração Avançada

Para personalizar o comportamento do CRM, você pode utilizar os hooks e componentes exportados individualmente:

```tsx
import { useContacts, ContactList, useDeals, DealList } from '@/features/crm';

function CustomCrmUI() {
  const { contacts, isLoading: contactsLoading } = useContacts();
  const { deals, isLoading: dealsLoading } = useDeals();
  
  return (
    <div className="custom-container">
      <div className="left-panel">
        <ContactList />
      </div>
      <div className="right-panel">
        {selectedContactId && <DealList contactId={selectedContactId} />}
      </div>
    </div>
  );
}
``` 