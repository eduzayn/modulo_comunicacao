'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export function SettingsSection() {
  const [settings, setSettings] = useState({
    showAgentAvatars: true,
    useCustomImage: false,
    callToAction: false,
    showWidgetOnMobile: true,
    hideWidgetButton: false,
    enableSounds: true,
    restrictDomain: false,
    enableWhatsAppBalloon: true,
    whatsAppNumber: '+55 (31) 971761350',
    whatsAppText: 'Encontrei vocês pelo google e quero mais informações.',
    useOnlyWhatsApp: false,
    captureFormInfo: false,
    enableBusinessHours: false
  })

  const handleSwitchChange = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: checked
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="showAgentAvatars">Mostrar avatares dos agentes</Label>
        </div>
        <Switch
          id="showAgentAvatars"
          checked={settings.showAgentAvatars}
          onCheckedChange={() => handleSwitchChange('showAgentAvatars')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="useCustomImage">Usar imagem personalizada</Label>
        </div>
        <Switch
          id="useCustomImage"
          checked={settings.useCustomImage}
          onCheckedChange={() => handleSwitchChange('useCustomImage')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="callToAction">Chamada para ação</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Adiciona uma chamada para ação no widget</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch
          id="callToAction"
          checked={settings.callToAction}
          onCheckedChange={() => handleSwitchChange('callToAction')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="showWidgetOnMobile">Mostrar widget no celular</Label>
        </div>
        <Switch
          id="showWidgetOnMobile"
          checked={settings.showWidgetOnMobile}
          onCheckedChange={() => handleSwitchChange('showWidgetOnMobile')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="hideWidgetButton">Esconder botão do widget</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Esconde o botão do widget na página</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch
          id="hideWidgetButton"
          checked={settings.hideWidgetButton}
          onCheckedChange={() => handleSwitchChange('hideWidgetButton')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="enableSounds">Habilitar sons</Label>
        </div>
        <Switch
          id="enableSounds"
          checked={settings.enableSounds}
          onCheckedChange={() => handleSwitchChange('enableSounds')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="restrictDomain">Restringir domínio</Label>
        </div>
        <Switch
          id="restrictDomain"
          checked={settings.restrictDomain}
          onCheckedChange={() => handleSwitchChange('restrictDomain')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="enableWhatsAppBalloon">Habilitar balão de WhatsApp</Label>
        </div>
        <Switch
          id="enableWhatsAppBalloon"
          checked={settings.enableWhatsAppBalloon}
          onCheckedChange={() => handleSwitchChange('enableWhatsAppBalloon')}
        />
      </div>

      {settings.enableWhatsAppBalloon && (
        <>
          <div className="space-y-2">
            <Label htmlFor="whatsAppNumber">Número</Label>
            <div className="flex items-center">
              <div className="mr-2 flex items-center border rounded-md px-2 py-1">
                <span className="inline-block mr-1">🇧🇷</span>
                <span>-</span>
              </div>
              <Input
                id="whatsAppNumber"
                value={settings.whatsAppNumber}
                onChange={(e) => handleInputChange('whatsAppNumber', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsAppText">Texto padrão</Label>
            <Textarea
              id="whatsAppText"
              value={settings.whatsAppText}
              onChange={(e) => handleInputChange('whatsAppText', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="useOnlyWhatsApp"
              checked={settings.useOnlyWhatsApp}
              onCheckedChange={(checked) => handleCheckboxChange('useOnlyWhatsApp', checked as boolean)}
            />
            <Label htmlFor="useOnlyWhatsApp">Usar somente WhatsApp</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="captureFormInfo"
              checked={settings.captureFormInfo}
              onCheckedChange={(checked) => handleCheckboxChange('captureFormInfo', checked as boolean)}
            />
            <Label htmlFor="captureFormInfo">Capturar informações de campanha</Label>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="enableBusinessHours">Habilitar horário comercial</Label>
          </div>
          <p className="text-sm text-muted-foreground">Mostra que os agentes estão online durante o horário comercial</p>
        </div>
        <Switch
          id="enableBusinessHours"
          checked={settings.enableBusinessHours}
          onCheckedChange={() => handleSwitchChange('enableBusinessHours')}
        />
      </div>

      <div className="pt-4">
        <Button>Salvar configurações</Button>
      </div>
    </div>
  )
} 