import { useState, useCallback } from 'react'
import { VoiceSettings } from '@/app/settings/knowledge-base/types'
import { ElevenLabsService } from '@/services/elevenlabs'

interface UseTextToSpeechProps {
  voiceSettings: VoiceSettings
}

interface UseTextToSpeechReturn {
  isLoading: boolean
  error: Error | null
  speak: (text: string) => Promise<void>
  stop: () => void
}

export function useTextToSpeech({ voiceSettings }: UseTextToSpeechProps): UseTextToSpeechReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const stop = useCallback(() => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setAudio(null)
    }
  }, [audio])

  const speak = useCallback(async (text: string) => {
    try {
      setIsLoading(true)
      setError(null)
      stop()

      const elevenLabs = new ElevenLabsService(process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY!)
      const audioData = await elevenLabs.textToSpeech(text, voiceSettings)
      
      const blob = new Blob([audioData], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      
      const newAudio = new Audio(url)
      newAudio.onended = () => {
        URL.revokeObjectURL(url)
        setAudio(null)
      }
      
      setAudio(newAudio)
      await newAudio.play()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao sintetizar voz'))
    } finally {
      setIsLoading(false)
    }
  }, [voiceSettings, stop])

  return {
    isLoading,
    error,
    speak,
    stop
  }
} 