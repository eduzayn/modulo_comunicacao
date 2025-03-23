'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export function TextsSection() {
  const [texts, setTexts] = useState({
    displayName: 'Grupo Zayn Educacional',
    offHoursMessage: 'Vamos te responder assim que possível.',
    teamDescription: 'Por favor, conte-nos um pouco sobre você:\n\nVocê já possui graduação superior ou está em busca da primeira?',
    initialMessage: '👋 Olá! Gostaria de ajuda para escolher seu curso?'
  })

  const handleChange = (field: string, value: string) => {
    setTexts(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="displayName">Nome de exibição</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Nome que será exibido no cabeçalho do widget</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="displayName"
          value={texts.displayName}
          onChange={(e) => handleChange('displayName', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="offHoursMessage">Mensagem de fora do expediente</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Mensagem exibida quando não há agentes online</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="offHoursMessage"
          value={texts.offHoursMessage}
          onChange={(e) => handleChange('offHoursMessage', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="teamDescription">Descrição do time</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Informações adicionais sobre seu time ou serviço</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Textarea
          id="teamDescription"
          value={texts.teamDescription}
          onChange={(e) => handleChange('teamDescription', e.target.value)}
          className="h-32 resize-y"
        />
        <div className="flex justify-between">
          <div className="flex gap-2 text-xs text-muted-foreground">
            <button 
              className="hover:text-foreground" 
              onClick={() => handleChange('teamDescription', texts.teamDescription + '\n')}
            >
              ⬆️
            </button>
            <button 
              className="hover:text-foreground"
              onClick={() => handleChange('teamDescription', texts.teamDescription + '\n')}
            >
              ⬇️
            </button>
          </div>
          <button
            className="hover:text-foreground text-xs text-muted-foreground"
            onClick={() => handleChange('teamDescription', texts.teamDescription + '\n')}
          >
            ✏️
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="initialMessage">Mensagem inicial</Label>
        <div className="relative">
          <div className="bg-muted p-4 rounded-md flex items-start space-x-2">
            <span className="text-amber-500">👋</span>
            <div className="flex-1">
              <Input
                id="initialMessage"
                value={texts.initialMessage}
                onChange={(e) => handleChange('initialMessage', e.target.value)}
                className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="flex justify-between mt-2">
                <button className="text-blue-600 text-xs">Mensagem</button>
                <button className="text-muted-foreground hover:text-foreground text-xs">✖️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 