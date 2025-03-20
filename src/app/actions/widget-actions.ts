'use server'

import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import type { ActionResponse } from '@/types/actions'
import widgetSettingsService from '@/services/supabase/widget-settings'
import { widgetSettingsSchema, formFieldsSchema } from '@/app/settings/widget/schemas'

// Cria um cliente de action seguro com validação do servidor
const action = createSafeActionClient()

// Função helper para o tratamento de erros padrão
const handleError = (error: any): ActionResponse<any> => {
  console.error('Widget action error:', error)
  return {
    success: false,
    error: {
      message: error.message || 'Ocorreu um erro ao processar a solicitação',
      code: error.code || 'UNKNOWN_ERROR'
    }
  }
}

// Ação para obter as configurações do widget
export const getWidgetSettings = action
  .action(async (): Promise<ActionResponse<any>> => {
    try {
      // Usar um ID de workspace fixo para testes
      // Em produção, isso seria obtido do contexto do usuário autenticado
      const workspaceId = 'default-workspace'
      const settings = await widgetSettingsService.getByWorkspaceId(workspaceId)
      
      return {
        success: true,
        data: settings
      }
    } catch (error) {
      return handleError(error)
    }
  })

// Ação para salvar as configurações do widget
export const saveWidgetSettings = action
  .schema(widgetSettingsSchema)
  .action(async (data): Promise<ActionResponse<any>> => {
    try {
      // Usar um ID de workspace fixo para testes
      // Em produção, isso seria obtido do contexto do usuário autenticado
      const workspaceId = 'default-workspace'
      const settings = await widgetSettingsService.saveSettings(workspaceId, data)
      
      return {
        success: true,
        data: settings
      }
    } catch (error) {
      return handleError(error)
    }
  })

// Ação para salvar os campos do formulário
export const saveFormFields = action
  .schema(z.object({
    widgetId: z.string(),
    fields: z.array(
      z.object({
        type: z.enum(['text', 'email', 'phone']),
        label: z.string(),
        required: z.boolean().default(false)
      })
    )
  }))
  .action(async (data): Promise<ActionResponse<any>> => {
    try {
      const { widgetId, fields } = data
      const savedFields = await widgetSettingsService.saveFormFields(widgetId, fields)
      
      return {
        success: true,
        data: savedFields
      }
    } catch (error) {
      return handleError(error)
    }
  })

// Ação para salvar os domínios restritos
export const saveDomains = action
  .schema(z.object({
    widgetId: z.string(),
    domains: z.array(z.string())
  }))
  .action(async (data): Promise<ActionResponse<any>> => {
    try {
      const { widgetId, domains } = data
      const savedDomains = await widgetSettingsService.saveDomains(widgetId, domains)
      
      return {
        success: true,
        data: savedDomains
      }
    } catch (error) {
      return handleError(error)
    }
  }) 