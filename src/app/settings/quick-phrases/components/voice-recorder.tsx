'use client'

import { Button } from '@/components/ui/button'
import { Mic, Square, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((time) => time + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRecording])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        onRecordingComplete(blob)
        setRecordingTime(0)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setError(null)
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err)
      setError('Não foi possível acessar o microfone')
    }
  }, [onRecordingComplete])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }, [mediaRecorder])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {isRecording ? (
        <>
          <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
          <Button
            variant="destructive"
            size="icon"
            onClick={stopRecording}
          >
            <Square className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={startRecording}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 