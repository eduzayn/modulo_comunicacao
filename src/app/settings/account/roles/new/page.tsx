'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const roleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  permissions: z.object({
    conversationAccess: z.object({
      global: z.boolean().optional(),
      byGroup: z.boolean().optional(),
      byRole: z.boolean().optional(),
      byGroupLimited: z.boolean().optional(),
      limited: z.boolean().optional(),
      restrict: z.boolean().optional(),
    }),
    conversations: z.object({
      receive: z.boolean().optional(),
      respond: z.boolean().optional(),
      respondOnlyAssigned: z.boolean().optional(),
      limitTimeToRespond: z.boolean().optional(),
      limitChannelsToRespond: z.boolean().optional(),
      blockBadWords: z.boolean().optional(),
      sendPrivateNotes: z.boolean().optional(),
      deleteOtherMessages: z.boolean().optional(),
      deleteOwnMessages: z.boolean().optional(),
      initiateChat: z.boolean().optional(),
      initiateOnlyWithAssigned: z.boolean().optional(),
      initiateOnlyWithAssignedToMe: z.boolean().optional(),
      initiateOnlyWithUnassigned: z.boolean().optional(),
      pause: z.boolean().optional(),
      categorize: z.boolean().optional(),
      assign: z.boolean().optional(),
      assignOnlyToGroup: z.boolean().optional(),
      moveToGroup: z.boolean().optional(),
      moveOnlyToOwnGroup: z.boolean().optional(),
      initiateBot: z.boolean().optional(),
      scheduleMessages: z.boolean().optional(),
    }),
    restrictions: z.object({
      hideUnassignedMessages: z.boolean().optional(),
      hideUnassignedWithAvatar: z.boolean().optional(),
      hideTagIfNotAssigned: z.boolean().optional(),
      cannotRemoveTag: z.boolean().optional(),
      cannotShareConversation: z.boolean().optional(),
      cannotBlockConversation: z.boolean().optional(),
      cannotSyncHistory: z.boolean().optional(),
      cannotExportCSV: z.boolean().optional(),
      hideContactNotes: z.boolean().optional(),
      hideContactInfo: z.boolean().optional(),
      hideSessionInfo: z.boolean().optional(),
      hideIntegrationInfo: z.boolean().optional(),
    }),
    deals: z.object({
      manage: z.boolean().optional(),
      cannotSeeOthersDeals: z.boolean().optional(),
      cannotSeeUnassignedDeals: z.boolean().optional(),
      cannotSeeGroupDeals: z.boolean().optional(),
      cannotSeeNoGroupDeals: z.boolean().optional(),
      cannotDeleteDeal: z.boolean().optional(),
      cannotExportDeals: z.boolean().optional(),
      cannotCreatePreviousStage: z.boolean().optional(),
      cannotCreateIfExists: z.boolean().optional(),
      canManageConversationDeals: z.boolean().optional(),
    }),
    rates: z.object({
      manageConversationRates: z.boolean().optional(),
      seeOthersRates: z.boolean().optional(),
    }),
    contacts: z.object({
      manage: z.boolean().optional(),
      cannotExport: z.boolean().optional(),
      merge: z.boolean().optional(),
      seePrivatePhones: z.boolean().optional(),
    }),
    environment: z.object({
      rooms: z.boolean().optional(),
      subscription: z.boolean().optional(),
      campaigns: z.boolean().optional(),
      whatsappCampaigns: z.boolean().optional(),
      schedules: z.boolean().optional(),
      filters: z.boolean().optional(),
      workspace: z.boolean().optional(),
      roles: z.boolean().optional(),
      channels: z.boolean().optional(),
      agents: z.boolean().optional(),
      groups: z.boolean().optional(),
      hours: z.boolean().optional(),
      fields: z.boolean().optional(),
      tags: z.boolean().optional(),
      quickReplies: z.boolean().optional(),
      autoAssignment: z.boolean().optional(),
      automations: z.boolean().optional(),
      bot: z.boolean().optional(),
      scenarios: z.boolean().optional(),
      integrations: z.boolean().optional(),
      audit: z.boolean().optional(),
      funnels: z.boolean().optional(),
      products: z.boolean().optional(),
      goals: z.boolean().optional(),
      knowledgeBase: z.boolean().optional(),
    }),
    other: z.object({
      blockBots: z.boolean().optional(),
      noAutoUnavailable: z.boolean().optional(),
      noAutoOffline: z.boolean().optional(),
    }),
    finalRestrictions: z.object({
      limitAvailableHours: z.boolean().optional(),
      cannotBeUnavailable: z.boolean().optional(),
      cannotChangeAvailability: z.boolean().optional(),
      cannotChangeProfile: z.boolean().optional(),
      cannotAccessRooms: z.boolean().optional(),
      onlySeeDMGroupMembers: z.boolean().optional(),
      cannotSeeChannelNotifications: z.boolean().optional(),
      onlySeeChannelsInGroup: z.boolean().optional(),
      noAutoMarkAsRead: z.boolean().optional(),
      noExpiredWorkspaceWarning: z.boolean().optional(),
    }),
  }),
})

type RoleForm = z.infer<typeof roleSchema>

interface CheckboxWithTooltipProps {
  id: string
  label: string
  tooltip?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

function CheckboxWithTooltip({
  id,
  label,
  tooltip,
  checked,
  onCheckedChange,
  disabled,
}: CheckboxWithTooltipProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-normal">
          {label}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}

interface PermissionSectionProps {
  title: string
  children: React.ReactNode
}

function PermissionSection({ title, children }: PermissionSectionProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-2 hover:bg-muted/80">
        <h3 className="text-sm font-medium">{title}</h3>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 px-4 py-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function NewRolePage() {
  const { register, handleSubmit, watch, setValue } = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      permissions: {
        conversationAccess: {},
        conversations: {},
        restrictions: {},
        deals: {},
        rates: {},
        contacts: {},
        environment: {},
        other: {},
        finalRestrictions: {},
      },
    },
  })

  const onSubmit = async (data: RoleForm) => {
    console.log(data)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Criar permissão</h2>
          <p className="text-sm text-muted-foreground">
            Configure as permissões para este perfil de acesso
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register('name')} />
        </div>

        <div className="space-y-4">
          <PermissionSection title="Acesso às Conversas">
            <CheckboxWithTooltip
              id="global"
              label="Global"
              tooltip="Acesso a todas as conversas do ambiente"
              checked={watch('permissions.conversationAccess.global')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversationAccess.global', checked)
              }
            />
            <CheckboxWithTooltip
              id="byGroup"
              label="Por grupo"
              tooltip="Acesso apenas às conversas do grupo"
              checked={watch('permissions.conversationAccess.byGroup')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversationAccess.byGroup', checked)
              }
            />
            <CheckboxWithTooltip
              id="byRole"
              label="Por perfil"
              tooltip="Acesso apenas às conversas do perfil"
              checked={watch('permissions.conversationAccess.byRole')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversationAccess.byRole', checked)
              }
            />
            <CheckboxWithTooltip
              id="byGroupLimited"
              label="Por grupo limitado"
              tooltip="Acesso limitado às conversas do grupo"
              checked={watch('permissions.conversationAccess.byGroupLimited')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversationAccess.byGroupLimited', checked)
              }
            />
            <CheckboxWithTooltip
              id="limited"
              label="Limitado"
              tooltip="Acesso limitado às conversas"
              checked={watch('permissions.conversationAccess.limited')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversationAccess.limited', checked)
              }
            />
            <CheckboxWithTooltip
              id="restrict"
              label="Restrito"
              tooltip="Acesso restrito às conversas"
              checked={watch('permissions.conversationAccess.restrict')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversationAccess.restrict', checked)
              }
            />
          </PermissionSection>

          <PermissionSection title="Conversas">
            <CheckboxWithTooltip
              id="receive"
              label="Receber"
              tooltip="Pode receber novas conversas"
              checked={watch('permissions.conversations.receive')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.receive', checked)
              }
            />
            <CheckboxWithTooltip
              id="respond"
              label="Responder"
              tooltip="Pode responder às conversas"
              checked={watch('permissions.conversations.respond')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.respond', checked)
              }
            />
            <CheckboxWithTooltip
              id="respondOnlyAssigned"
              label="Responder apenas atribuídas"
              tooltip="Pode responder apenas às conversas atribuídas"
              checked={watch('permissions.conversations.respondOnlyAssigned')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.respondOnlyAssigned', checked)
              }
            />
            <CheckboxWithTooltip
              id="limitTimeToRespond"
              label="Limitar tempo de resposta"
              tooltip="Limita o tempo para responder às conversas"
              checked={watch('permissions.conversations.limitTimeToRespond')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.limitTimeToRespond', checked)
              }
            />
            <CheckboxWithTooltip
              id="limitChannelsToRespond"
              label="Limitar canais para resposta"
              tooltip="Limita os canais em que pode responder"
              checked={watch('permissions.conversations.limitChannelsToRespond')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.limitChannelsToRespond', checked)
              }
            />
            <CheckboxWithTooltip
              id="blockBadWords"
              label="Bloquear palavras inadequadas"
              tooltip="Bloqueia o uso de palavras inadequadas"
              checked={watch('permissions.conversations.blockBadWords')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.blockBadWords', checked)
              }
            />
            <CheckboxWithTooltip
              id="sendPrivateNotes"
              label="Enviar notas privadas"
              tooltip="Pode enviar notas privadas nas conversas"
              checked={watch('permissions.conversations.sendPrivateNotes')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.sendPrivateNotes', checked)
              }
            />
            <CheckboxWithTooltip
              id="deleteOtherMessages"
              label="Deletar mensagens de outros"
              tooltip="Pode deletar mensagens de outros usuários"
              checked={watch('permissions.conversations.deleteOtherMessages')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.deleteOtherMessages', checked)
              }
            />
            <CheckboxWithTooltip
              id="deleteOwnMessages"
              label="Deletar próprias mensagens"
              tooltip="Pode deletar suas próprias mensagens"
              checked={watch('permissions.conversations.deleteOwnMessages')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.deleteOwnMessages', checked)
              }
            />
            <CheckboxWithTooltip
              id="initiateChat"
              label="Iniciar chat"
              tooltip="Pode iniciar novas conversas"
              checked={watch('permissions.conversations.initiateChat')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.initiateChat', checked)
              }
            />
            <CheckboxWithTooltip
              id="pause"
              label="Pausar"
              tooltip="Pode pausar conversas"
              checked={watch('permissions.conversations.pause')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.pause', checked)
              }
            />
            <CheckboxWithTooltip
              id="categorize"
              label="Categorizar"
              tooltip="Pode categorizar conversas"
              checked={watch('permissions.conversations.categorize')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.categorize', checked)
              }
            />
            <CheckboxWithTooltip
              id="assign"
              label="Atribuir"
              tooltip="Pode atribuir conversas"
              checked={watch('permissions.conversations.assign')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.assign', checked)
              }
            />
            <CheckboxWithTooltip
              id="moveToGroup"
              label="Mover para grupo"
              tooltip="Pode mover conversas entre grupos"
              checked={watch('permissions.conversations.moveToGroup')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.moveToGroup', checked)
              }
            />
            <CheckboxWithTooltip
              id="initiateBot"
              label="Iniciar bot"
              tooltip="Pode iniciar interações com bot"
              checked={watch('permissions.conversations.initiateBot')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.initiateBot', checked)
              }
            />
            <CheckboxWithTooltip
              id="scheduleMessages"
              label="Agendar mensagens"
              tooltip="Pode agendar mensagens"
              checked={watch('permissions.conversations.scheduleMessages')}
              onCheckedChange={(checked) =>
                setValue('permissions.conversations.scheduleMessages', checked)
              }
            />
          </PermissionSection>

          <PermissionSection title="Restrições">
            <CheckboxWithTooltip
              id="hideUnassignedMessages"
              label="Ocultar mensagens não atribuídas"
              tooltip="Oculta mensagens que não estão atribuídas"
              checked={watch('permissions.restrictions.hideUnassignedMessages')}
              onCheckedChange={(checked) =>
                setValue('permissions.restrictions.hideUnassignedMessages', checked)
              }
            />
            <CheckboxWithTooltip
              id="hideTagIfNotAssigned"
              label="Ocultar tag se não atribuído"
              tooltip="Oculta tags de conversas não atribuídas"
              checked={watch('permissions.restrictions.hideTagIfNotAssigned')}
              onCheckedChange={(checked) =>
                setValue('permissions.restrictions.hideTagIfNotAssigned', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotRemoveTag"
              label="Não pode remover tag"
              tooltip="Não permite remover tags"
              checked={watch('permissions.restrictions.cannotRemoveTag')}
              onCheckedChange={(checked) =>
                setValue('permissions.restrictions.cannotRemoveTag', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotShareConversation"
              label="Não pode compartilhar conversa"
              tooltip="Não permite compartilhar conversas"
              checked={watch('permissions.restrictions.cannotShareConversation')}
              onCheckedChange={(checked) =>
                setValue('permissions.restrictions.cannotShareConversation', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotBlockConversation"
              label="Não pode bloquear conversa"
              tooltip="Não permite bloquear conversas"
              checked={watch('permissions.restrictions.cannotBlockConversation')}
              onCheckedChange={(checked) =>
                setValue('permissions.restrictions.cannotBlockConversation', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotSyncHistory"
              label="Não pode sincronizar histórico"
              tooltip="Não permite sincronizar histórico"
              checked={watch('permissions.restrictions.cannotSyncHistory')}
              onCheckedChange={(checked) =>
                setValue('permissions.restrictions.cannotSyncHistory', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotExportCSV"
              label="Não pode exportar CSV"
              tooltip="Não permite exportar dados em CSV"
              checked={watch('permissions.restrictions.cannotExportCSV')}
              onCheckedChange={(checked) =>
                setValue('permissions.restrictions.cannotExportCSV', checked)
              }
            />
            <CheckboxWithTooltip
              id="hideContactNotes"
              label="Ocultar notas de contato"
              tooltip="Oculta as notas dos contatos"
              checked={watch('permissions.restrictions.hideContactNotes')}
              onCheckedChange={(checked) =>
                setValue('permissions.restrictions.hideContactNotes', checked)
              }
            />
            <CheckboxWithTooltip
              id="hideContactInfo"
              label="Ocultar informações de contato"
              tooltip="Oculta informações dos contatos"
              checked={watch('permissions.restrictions.hideContactInfo')}
              onCheckedChange={(checked) =>
                setValue('permissions.restrictions.hideContactInfo', checked)
              }
            />
          </PermissionSection>

          <PermissionSection title="Negociações">
            <CheckboxWithTooltip
              id="manageDeals"
              label="Gerenciar negociações"
              tooltip="Pode gerenciar negociações"
              checked={watch('permissions.deals.manage')}
              onCheckedChange={(checked) =>
                setValue('permissions.deals.manage', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotSeeOthersDeals"
              label="Não pode ver negociações de outros"
              tooltip="Não permite ver negociações de outros usuários"
              checked={watch('permissions.deals.cannotSeeOthersDeals')}
              onCheckedChange={(checked) =>
                setValue('permissions.deals.cannotSeeOthersDeals', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotSeeUnassignedDeals"
              label="Não pode ver negociações não atribuídas"
              tooltip="Não permite ver negociações não atribuídas"
              checked={watch('permissions.deals.cannotSeeUnassignedDeals')}
              onCheckedChange={(checked) =>
                setValue('permissions.deals.cannotSeeUnassignedDeals', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotDeleteDeal"
              label="Não pode deletar negociação"
              tooltip="Não permite deletar negociações"
              checked={watch('permissions.deals.cannotDeleteDeal')}
              onCheckedChange={(checked) =>
                setValue('permissions.deals.cannotDeleteDeal', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotExportDeals"
              label="Não pode exportar negociações"
              tooltip="Não permite exportar negociações"
              checked={watch('permissions.deals.cannotExportDeals')}
              onCheckedChange={(checked) =>
                setValue('permissions.deals.cannotExportDeals', checked)
              }
            />
          </PermissionSection>

          <PermissionSection title="Tarifas">
            <CheckboxWithTooltip
              id="manageConversationRates"
              label="Gerenciar tarifas de conversas"
              tooltip="Pode gerenciar tarifas das conversas"
              checked={watch('permissions.rates.manageConversationRates')}
              onCheckedChange={(checked) =>
                setValue('permissions.rates.manageConversationRates', checked)
              }
            />
            <CheckboxWithTooltip
              id="seeOthersRates"
              label="Ver tarifas de outros"
              tooltip="Pode ver tarifas de outros usuários"
              checked={watch('permissions.rates.seeOthersRates')}
              onCheckedChange={(checked) =>
                setValue('permissions.rates.seeOthersRates', checked)
              }
            />
          </PermissionSection>

          <PermissionSection title="Contatos">
            <CheckboxWithTooltip
              id="manageContacts"
              label="Gerenciar contatos"
              tooltip="Pode gerenciar contatos"
              checked={watch('permissions.contacts.manage')}
              onCheckedChange={(checked) =>
                setValue('permissions.contacts.manage', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotExportContacts"
              label="Não pode exportar contatos"
              tooltip="Não permite exportar contatos"
              checked={watch('permissions.contacts.cannotExport')}
              onCheckedChange={(checked) =>
                setValue('permissions.contacts.cannotExport', checked)
              }
            />
            <CheckboxWithTooltip
              id="mergeContacts"
              label="Mesclar contatos"
              tooltip="Pode mesclar contatos"
              checked={watch('permissions.contacts.merge')}
              onCheckedChange={(checked) =>
                setValue('permissions.contacts.merge', checked)
              }
            />
            <CheckboxWithTooltip
              id="seePrivatePhones"
              label="Ver telefones privados"
              tooltip="Pode ver telefones privados"
              checked={watch('permissions.contacts.seePrivatePhones')}
              onCheckedChange={(checked) =>
                setValue('permissions.contacts.seePrivatePhones', checked)
              }
            />
          </PermissionSection>

          <PermissionSection title="Gerenciar Ambiente">
            <CheckboxWithTooltip
              id="rooms"
              label="Salas"
              tooltip="Pode gerenciar salas"
              checked={watch('permissions.environment.rooms')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.rooms', checked)
              }
            />
            <CheckboxWithTooltip
              id="subscription"
              label="Assinatura"
              tooltip="Pode gerenciar assinatura"
              checked={watch('permissions.environment.subscription')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.subscription', checked)
              }
            />
            <CheckboxWithTooltip
              id="campaigns"
              label="Campanhas"
              tooltip="Pode gerenciar campanhas"
              checked={watch('permissions.environment.campaigns')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.campaigns', checked)
              }
            />
            <CheckboxWithTooltip
              id="whatsappCampaigns"
              label="Campanhas WhatsApp"
              tooltip="Pode gerenciar campanhas do WhatsApp"
              checked={watch('permissions.environment.whatsappCampaigns')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.whatsappCampaigns', checked)
              }
            />
            <CheckboxWithTooltip
              id="schedules"
              label="Agendamentos"
              tooltip="Pode gerenciar agendamentos"
              checked={watch('permissions.environment.schedules')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.schedules', checked)
              }
            />
            <CheckboxWithTooltip
              id="filters"
              label="Filtros"
              tooltip="Pode gerenciar filtros"
              checked={watch('permissions.environment.filters')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.filters', checked)
              }
            />
            <CheckboxWithTooltip
              id="workspace"
              label="Workspace"
              tooltip="Pode gerenciar workspace"
              checked={watch('permissions.environment.workspace')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.workspace', checked)
              }
            />
            <CheckboxWithTooltip
              id="roles"
              label="Perfis"
              tooltip="Pode gerenciar perfis"
              checked={watch('permissions.environment.roles')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.roles', checked)
              }
            />
            <CheckboxWithTooltip
              id="channels"
              label="Canais"
              tooltip="Pode gerenciar canais"
              checked={watch('permissions.environment.channels')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.channels', checked)
              }
            />
            <CheckboxWithTooltip
              id="agents"
              label="Agentes"
              tooltip="Pode gerenciar agentes"
              checked={watch('permissions.environment.agents')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.agents', checked)
              }
            />
            <CheckboxWithTooltip
              id="groups"
              label="Grupos"
              tooltip="Pode gerenciar grupos"
              checked={watch('permissions.environment.groups')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.groups', checked)
              }
            />
            <CheckboxWithTooltip
              id="hours"
              label="Horários"
              tooltip="Pode gerenciar horários"
              checked={watch('permissions.environment.hours')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.hours', checked)
              }
            />
            <CheckboxWithTooltip
              id="fields"
              label="Campos"
              tooltip="Pode gerenciar campos"
              checked={watch('permissions.environment.fields')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.fields', checked)
              }
            />
            <CheckboxWithTooltip
              id="tags"
              label="Tags"
              tooltip="Pode gerenciar tags"
              checked={watch('permissions.environment.tags')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.tags', checked)
              }
            />
            <CheckboxWithTooltip
              id="quickReplies"
              label="Respostas rápidas"
              tooltip="Pode gerenciar respostas rápidas"
              checked={watch('permissions.environment.quickReplies')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.quickReplies', checked)
              }
            />
            <CheckboxWithTooltip
              id="autoAssignment"
              label="Atribuição automática"
              tooltip="Pode gerenciar atribuição automática"
              checked={watch('permissions.environment.autoAssignment')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.autoAssignment', checked)
              }
            />
            <CheckboxWithTooltip
              id="automations"
              label="Automações"
              tooltip="Pode gerenciar automações"
              checked={watch('permissions.environment.automations')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.automations', checked)
              }
            />
            <CheckboxWithTooltip
              id="bot"
              label="Bot"
              tooltip="Pode gerenciar bot"
              checked={watch('permissions.environment.bot')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.bot', checked)
              }
            />
            <CheckboxWithTooltip
              id="scenarios"
              label="Cenários"
              tooltip="Pode gerenciar cenários"
              checked={watch('permissions.environment.scenarios')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.scenarios', checked)
              }
            />
            <CheckboxWithTooltip
              id="integrations"
              label="Integrações"
              tooltip="Pode gerenciar integrações"
              checked={watch('permissions.environment.integrations')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.integrations', checked)
              }
            />
            <CheckboxWithTooltip
              id="audit"
              label="Auditoria"
              tooltip="Pode acessar auditoria"
              checked={watch('permissions.environment.audit')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.audit', checked)
              }
            />
            <CheckboxWithTooltip
              id="funnels"
              label="Funis"
              tooltip="Pode gerenciar funis"
              checked={watch('permissions.environment.funnels')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.funnels', checked)
              }
            />
            <CheckboxWithTooltip
              id="products"
              label="Produtos"
              tooltip="Pode gerenciar produtos"
              checked={watch('permissions.environment.products')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.products', checked)
              }
            />
            <CheckboxWithTooltip
              id="goals"
              label="Metas"
              tooltip="Pode gerenciar metas"
              checked={watch('permissions.environment.goals')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.goals', checked)
              }
            />
            <CheckboxWithTooltip
              id="knowledgeBase"
              label="Base de conhecimento"
              tooltip="Pode gerenciar base de conhecimento"
              checked={watch('permissions.environment.knowledgeBase')}
              onCheckedChange={(checked) =>
                setValue('permissions.environment.knowledgeBase', checked)
              }
            />
          </PermissionSection>

          <PermissionSection title="Outros">
            <CheckboxWithTooltip
              id="blockBots"
              label="Bloquear bots"
              tooltip="Pode bloquear bots"
              checked={watch('permissions.other.blockBots')}
              onCheckedChange={(checked) =>
                setValue('permissions.other.blockBots', checked)
              }
            />
            <CheckboxWithTooltip
              id="noAutoUnavailable"
              label="Não ficar indisponível automaticamente"
              tooltip="Não fica indisponível automaticamente"
              checked={watch('permissions.other.noAutoUnavailable')}
              onCheckedChange={(checked) =>
                setValue('permissions.other.noAutoUnavailable', checked)
              }
            />
            <CheckboxWithTooltip
              id="noAutoOffline"
              label="Não ficar offline automaticamente"
              tooltip="Não fica offline automaticamente"
              checked={watch('permissions.other.noAutoOffline')}
              onCheckedChange={(checked) =>
                setValue('permissions.other.noAutoOffline', checked)
              }
            />
          </PermissionSection>

          <PermissionSection title="Restrições Finais">
            <CheckboxWithTooltip
              id="limitAvailableHours"
              label="Limitar horários disponíveis"
              tooltip="Limita os horários em que pode estar disponível"
              checked={watch('permissions.finalRestrictions.limitAvailableHours')}
              onCheckedChange={(checked) =>
                setValue('permissions.finalRestrictions.limitAvailableHours', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotBeUnavailable"
              label="Não pode ficar indisponível"
              tooltip="Não permite ficar indisponível"
              checked={watch('permissions.finalRestrictions.cannotBeUnavailable')}
              onCheckedChange={(checked) =>
                setValue('permissions.finalRestrictions.cannotBeUnavailable', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotChangeAvailability"
              label="Não pode alterar disponibilidade"
              tooltip="Não permite alterar disponibilidade"
              checked={watch('permissions.finalRestrictions.cannotChangeAvailability')}
              onCheckedChange={(checked) =>
                setValue('permissions.finalRestrictions.cannotChangeAvailability', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotChangeProfile"
              label="Não pode alterar perfil"
              tooltip="Não permite alterar perfil"
              checked={watch('permissions.finalRestrictions.cannotChangeProfile')}
              onCheckedChange={(checked) =>
                setValue('permissions.finalRestrictions.cannotChangeProfile', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotAccessRooms"
              label="Não pode acessar salas"
              tooltip="Não permite acessar salas"
              checked={watch('permissions.finalRestrictions.cannotAccessRooms')}
              onCheckedChange={(checked) =>
                setValue('permissions.finalRestrictions.cannotAccessRooms', checked)
              }
            />
            <CheckboxWithTooltip
              id="onlySeeDMGroupMembers"
              label="Ver apenas membros do grupo em DM"
              tooltip="Só pode ver membros do próprio grupo em mensagens diretas"
              checked={watch('permissions.finalRestrictions.onlySeeDMGroupMembers')}
              onCheckedChange={(checked) =>
                setValue('permissions.finalRestrictions.onlySeeDMGroupMembers', checked)
              }
            />
            <CheckboxWithTooltip
              id="cannotSeeChannelNotifications"
              label="Não ver notificações de canal"
              tooltip="Não pode ver notificações de canal"
              checked={watch('permissions.finalRestrictions.cannotSeeChannelNotifications')}
              onCheckedChange={(checked) =>
                setValue('permissions.finalRestrictions.cannotSeeChannelNotifications', checked)
              }
            />
            <CheckboxWithTooltip
              id="onlySeeChannelsInGroup"
              label="Ver apenas canais do grupo"
              tooltip="Só pode ver canais do próprio grupo"
              checked={watch('permissions.finalRestrictions.onlySeeChannelsInGroup')}
              onCheckedChange={(checked) =>
                setValue('permissions.finalRestrictions.onlySeeChannelsInGroup', checked)
              }
            />
            <CheckboxWithTooltip
              id="noAutoMarkAsRead"
              label="Não marcar como lido automaticamente"
              tooltip="Não marca conversas como lidas automaticamente"
              checked={watch('permissions.finalRestrictions.noAutoMarkAsRead')}
              onCheckedChange={(checked) =>
                setValue('permissions.finalRestrictions.noAutoMarkAsRead', checked)
              }
            />
            <CheckboxWithTooltip
              id="noExpiredWorkspaceWarning"
              label="Sem aviso de workspace expirado"
              tooltip="Não exibe aviso de workspace expirado"
              checked={watch('permissions.finalRestrictions.noExpiredWorkspaceWarning')}
              onCheckedChange={(checked) =>
                setValue('permissions.finalRestrictions.noExpiredWorkspaceWarning', checked)
              }
            />
          </PermissionSection>
        </div>

        <Button type="submit">Salvar</Button>
      </form>
    </div>
  )
} 