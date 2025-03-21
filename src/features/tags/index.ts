/**
 * Módulo de Tags - Exportação dos principais recursos
 */

// Tipos
export type {
  Tag,
  TagFilter,
  TagWithUsageCount,
  CreateTagPayload,
  UpdateTagPayload,
  TagServiceResponse
} from './types';

// Serviços
export { tagService } from './services/tag-service';

// Hooks
export { useTags } from './hooks/useTags';

// Componentes
// TODO: Adicionar componentes quando implementados
// export { TagPicker } from './components/TagPicker';
// export { TagList } from './components/TagList';
// export { TagBadge } from './components/TagBadge'; 