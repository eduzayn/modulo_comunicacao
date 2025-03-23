'use client'

import { useState, useEffect } from 'react'
import { Button } from './button'
import { Loader2, Play, Square } from 'lucide-react'
import { useTextToSpeech } from '@/hooks/use-text-to-speech'
import { VoiceSettings } from '@/app/settings/knowledge-base/types'

interface AudioPlayerProps {
  text: string
  voiceSettings: VoiceSettings
}

export function AudioPlayer({ text, voiceSettings }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { speak, stop, isLoading, error } = useTextToSpeech({ voiceSettings })

  // Garantir que o componente só seja renderizado no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handlePlay = async () => {
    try {
      if (isPlaying) {
        stop()
        setIsPlaying(false)
      } else {
        setIsPlaying(true)
        await speak(text)
        setIsPlaying(false)
      }
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error)
      setIsPlaying(false)
    }
  }

  // Não renderizar nada até que o componente esteja montado no cliente
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePlay}
        disabled={isLoading}
        aria-label={isPlaying ? 'Parar reprodução' : 'Reproduzir áudio'}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Square className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      {error && (
        <span className="text-sm text-destructive">
          Erro ao reproduzir áudio
        </span>
      )}
    </div>
  )
} 