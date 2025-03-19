'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createQuickPhraseSchema, type CreateQuickPhraseFormData } from '../schemas'
import { useCreateQuickPhrase } from '../hooks/use-quick-phrases'
import { toast } from 'sonner'
import { ChevronLeft, Paperclip } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { VoiceRecorder } from './voice-recorder'
import { VoicePlayer } from './voice-player'
import { useState } from 'react'

export function QuickPhraseForm() {
  const router = useRouter()
  const { mutateAsync: createPhrase, isPending } = useCreateQuickPhrase()
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateQuickPhraseFormData>({
    resolver: zodResolver(createQuickPhraseSchema),
    defaultValues: {
      type: 'text',
      visibility: 'all',
      assignedTo: [],
    },
  })

  const type = watch('type')

  const handleVoiceRecordingComplete = (blob: Blob) => {
    setValue('voiceMessage', blob)
    setVoiceUrl(URL.createObjectURL(blob))
  }

  const onSubmit = async (data: CreateQuickPhraseFormData) => {
    try {
      await createPhrase(data)
      toast.success('Frase rápida criada com sucesso!')
      reset()
      router.push('/settings/quick-phrases')
    } catch (error) {
      console.error('Erro ao criar frase rápida:', error)
      toast.error('Erro ao criar frase rápida. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push('/settings/quick-phrases')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Criar frase rápida</h1>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div className="grid gap-2">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={watch('type')}
            onValueChange={(value) => setValue('type', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="voice">Mensagem de voz</SelectItem>
              <SelectItem value="template">Template</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <span className="text-sm text-red-500">{errors.type.message}</span>
          )}
        </div>

        {type === 'text' && (
          <div className="grid gap-2">
            <Label htmlFor="phrase">Texto</Label>
            <Textarea
              id="phrase"
              {...register('phrase')}
              className={errors.phrase ? 'border-red-500' : ''}
            />
            {errors.phrase && (
              <span className="text-sm text-red-500">{errors.phrase.message}</span>
            )}
          </div>
        )}

        {type === 'voice' && (
          <div className="grid gap-4">
            <Label>Mensagem de voz</Label>
            {voiceUrl ? (
              <VoicePlayer src={voiceUrl} />
            ) : (
              <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} />
            )}
            {errors.voiceMessage && (
              <span className="text-sm text-red-500">{errors.voiceMessage.message}</span>
            )}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="shortcut">Atalho</Label>
          <Input
            id="shortcut"
            {...register('shortcut')}
            className={errors.shortcut ? 'border-red-500' : ''}
          />
          {errors.shortcut && (
            <span className="text-sm text-red-500">{errors.shortcut.message}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="visibility">Visível para</Label>
          <Select
            value={watch('visibility')}
            onValueChange={(value) => setValue('visibility', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os agentes</SelectItem>
              <SelectItem value="group">Grupo específico</SelectItem>
              <SelectItem value="personal">Apenas para mim</SelectItem>
            </SelectContent>
          </Select>
          {errors.visibility && (
            <span className="text-sm text-red-500">{errors.visibility.message}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => document.getElementById('attachments')?.click()}
          >
            <Paperclip className="h-4 w-4" />
            Anexar documentos
          </Button>
          <input
            type="file"
            id="attachments"
            className="hidden"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              setValue('attachments', files)
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/settings/quick-phrases')}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
} 