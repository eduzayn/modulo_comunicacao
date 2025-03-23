'use client'

import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { WidgetTheme, WidgetPosition, WidgetTextColor } from '../types'

export function AppearanceSection() {
  const [appearance, setAppearance] = useState({
    theme: 'blue' as WidgetTheme,
    textColor: 'light' as WidgetTextColor,
    position: 'right' as WidgetPosition,
    lateralSpacing: 20,
    bottomSpacing: 60
  })

  const handleThemeChange = (value: WidgetTheme) => {
    setAppearance(prev => ({ ...prev, theme: value }))
  }

  const handleTextColorChange = (value: WidgetTextColor) => {
    setAppearance(prev => ({ ...prev, textColor: value }))
  }

  const handlePositionChange = (value: WidgetPosition) => {
    setAppearance(prev => ({ ...prev, position: value }))
  }

  const handleSpacingChange = (key: 'lateralSpacing' | 'bottomSpacing', value: string) => {
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue)) {
      setAppearance(prev => ({ ...prev, [key]: numValue }))
    }
  }

  const themeOptions: { value: WidgetTheme; color: string }[] = [
    { value: 'black', color: 'bg-black' },
    { value: 'purple', color: 'bg-purple-600' },
    { value: 'blue', color: 'bg-blue-600' },
    { value: 'green', color: 'bg-green-600' },
    { value: 'teal', color: 'bg-teal-500' },
    { value: 'yellow', color: 'bg-yellow-400' },
    { value: 'orange', color: 'bg-orange-500' },
    { value: 'red', color: 'bg-red-600' },
    { value: 'pink', color: 'bg-pink-600' },
    { value: 'indigo', color: 'bg-indigo-600' }
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Tema</Label>
        <div className="flex flex-wrap gap-2">
          {themeOptions.map((theme) => (
            <button
              key={theme.value}
              className={`w-8 h-8 rounded-full ${theme.color} ${
                appearance.theme === theme.value
                  ? 'ring-2 ring-offset-2 ring-blue-600'
                  : ''
              }`}
              onClick={() => handleThemeChange(theme.value)}
              type="button"
              aria-label={`Tema ${theme.value}`}
            />
          ))}
          <button
            className="w-8 h-8 rounded-full border border-dashed border-gray-400 flex items-center justify-center"
            type="button"
            aria-label="Tema personalizado"
            onClick={() => handleThemeChange('custom')}
          >
            <span className="text-gray-500">🎨</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Cor do texto</Label>
        <RadioGroup
          value={appearance.textColor}
          onValueChange={(value) => handleTextColorChange(value as WidgetTextColor)}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Claro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Escuro</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>Posição na tela</Label>
        <RadioGroup
          value={appearance.position}
          onValueChange={(value) => handlePositionChange(value as WidgetPosition)}
          className="flex flex-col space-y-4"
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="right">Direita</Label>
            <RadioGroupItem value="right" id="right" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="left">Esquerda</Label>
            <RadioGroupItem value="left" id="left" />
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lateralSpacing">Espaçamento lateral</Label>
          <div className="flex items-center">
            <Input
              id="lateralSpacing"
              type="number"
              value={appearance.lateralSpacing}
              onChange={(e) => handleSpacingChange('lateralSpacing', e.target.value)}
              min={0}
              max={100}
            />
            <span className="ml-2">px</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bottomSpacing">Espaçamento embaixo</Label>
          <div className="flex items-center">
            <Input
              id="bottomSpacing"
              type="number"
              value={appearance.bottomSpacing}
              onChange={(e) => handleSpacingChange('bottomSpacing', e.target.value)}
              min={0}
              max={100}
            />
            <span className="ml-2">px</span>
          </div>
        </div>
      </div>
    </div>
  )
} 