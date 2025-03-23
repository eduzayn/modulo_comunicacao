// Componentes
export { CrmDashboard } from './components/CrmDashboard'
export { ContactList } from './components/ContactList'
export { DealList } from './components/DealList'

// Hooks
export { useContacts } from './hooks/use-contacts'
export { useDeals } from './hooks/use-deals'

// Serviços
export {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  createDeal,
  getDealsByContact,
  updateDealStage,
  deleteDeal
} from './services/crm-service'

// Tipos
export type {
  Contact,
  ContactFormData,
  ContactFilters,
  ContactsState,
  Deal,
  CreateDealData,
  DealState,
  FunnelStage
} from './types/crm.types'

export {
  formatCurrency,
  getStageLabel,
  generateMockDeals
} from './types/crm.types' 