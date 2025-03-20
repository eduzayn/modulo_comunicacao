/**
 * Exportações da feature de settings (configurações)
 */

// Componentes
export { AutomationForm } from './components/automations/AutomationForm'
export { BotForm } from './components/bots/BotForm'
export { CourseForm } from './components/courses/CourseForm'
export { PipelineForm } from './components/pipelines/PipelineForm'
export { CadenceForm } from './components/pipelines/CadenceForm'
export { AssignmentRuleForm } from './components/assignment-rules/AssignmentRuleForm'
export { WorkflowForm } from './components/workflows/WorkflowForm'

// Hooks
export { 
  useBots, 
  useAutomations, 
  useChannels, 
  usePipelines 
} from './hooks/use-settings'

// Serviços
export {
  // Automações
  getAutomations,
  createAutomation,
  toggleAutomation,
  
  // Bots
  getBots,
  createBot,
  toggleBot,
  
  // Canais
  getChannels,
  
  // Pipelines
  getPipelines,
  createPipeline
} from './services/settings-service'

// Tipos
export type {
  BaseConfig,
  
  // Automações
  Automation,
  CreateAutomationInput,
  
  // Bots
  Bot,
  CreateBotInput,
  
  // Canais
  Channel,
  
  // Pipelines
  Pipeline,
  PipelineStage,
  CreatePipelineInput,
  
  // Regras de Atribuição
  AssignmentRule,
  CreateAssignmentRuleInput,
  
  // Cursos
  Course,
  CourseModule,
  CourseLesson,
  CreateCourseInput
} from './types/settings.types' 