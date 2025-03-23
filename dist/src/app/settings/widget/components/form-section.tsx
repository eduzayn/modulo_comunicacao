'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, GripVertical, Plus } from 'lucide-react'

export function FormSection() {
  const [formDescription, setFormDescription] = useState(
    'Bem-vindo! Por favor preencha o formulário abaixo antes de iniciar o chat.'
  )
  
  const [fields, setFields] = useState([
    { id: '1', type: 'text', label: 'Nome', required: true },
    { id: '2', type: 'email', label: 'E-mail', required: true },
    { id: '3', type: 'phone', label: 'Telefone de Contato:', required: false }
  ])

  const handleAddField = () => {
    setFields([
      ...fields,
      { id: Date.now().toString(), type: 'text', label: 'Campo', required: false }
    ])
  }

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(field => field.id !== id))
  }

  const handleUpdateField = (id: string, key: string, value: any) => {
    setFields(
      fields.map(field => 
        field.id === id ? { ...field, [key]: value } : field
      )
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        O formulário pré-chat permite que você colete informações do visitante antes do início do chat.
      </p>

      <div className="space-y-2">
        <Label htmlFor="formDescription">Descrição</Label>
        <Textarea
          id="formDescription"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          className="resize-y"
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Campos</h3>
        
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className="flex items-center gap-2 p-3 border rounded-md bg-background"
            >
              <div className="cursor-move text-muted-foreground">
                <GripVertical size={16} />
              </div>
              
              <div className="flex-1 flex items-center gap-2">
                <div className="flex items-center space-x-2 min-w-[100px]">
                  {field.type === 'text' && <span>Aa</span>}
                  {field.type === 'email' && <span>✉️</span>}
                  {field.type === 'phone' && <span>☎️</span>}
                  <Input
                    value={field.label}
                    onChange={(e) => handleUpdateField(field.id, 'label', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${field.id}`}
                  checked={field.required}
                  onCheckedChange={(checked) => 
                    handleUpdateField(field.id, 'required', !!checked)
                  }
                />
                <Label htmlFor={`required-${field.id}`} className="text-sm">
                  Obrigatório
                </Label>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveField(field.id)}
              >
                <Trash2 size={16} className="text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleAddField}
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          Campo
        </Button>
      </div>
    </div>
  )
} 