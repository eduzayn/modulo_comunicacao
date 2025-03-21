/**
 * Módulo CRM - Exportação dos principais recursos
 */

// Feature CRM exports

// Serviços
export { crmService } from './services/crm-service';

// Hooks
export { useDeals } from './hooks/useDeals';
export { useActivities } from './hooks/useActivities';

// Tipos
export type {
  DealFilter,
  DealWithRelations,
  DealActivityWithUser,
  DealStats,
  CreateDealPayload,
  UpdateDealPayload,
  CreateActivityPayload
} from './types';

// Componentes
// TODO: Adicionar componentes quando implementados
// export { DealCard } from './components/DealCard';
// export { DealList } from './components/DealList';
// export { ActivityForm } from './components/ActivityForm';
