'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Button } from './button'
import { Mic, Square, Trash, Send, Loader2 } from 'lucide-react'
import { Progress } from './progress'

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => Promise<void>
  onCancel?: () => void
  maxDurationSeconds?: number // Duração máxima em segundos
  className?: string
}

export function VoiceRecorder({
  onRecordingComplete,
  onCancel,
  maxDurationSeconds = 60,
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Efeito para gerenciar o timer durante a gravação
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((time) => {
          // Parar automaticamente se atingir o tempo máximo
          if (time >= maxDurationSeconds) {
            stopRecording()
            return maxDurationSeconds
          }
          return time + 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording, isPaused, maxDurationSeconds])
  
  // Limpar recursos quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])
  
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      audioChunksRef.current = []
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
      }
      
      setAudioBlob(null)
      setRecordingTime(0)
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        
        setAudioBlob(audioBlob)
        setAudioUrl(url)
        setIsRecording(false)
        
        // Liberar os recursos do microfone
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
      }
      
      mediaRecorder.start(200) // Capturar dados a cada 200ms
      setIsRecording(true)
      setIsPaused(false)
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err)
      setError('Não foi possível acessar o microfone')
    }
  }, [audioUrl])
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])
  
  const cancelRecording = useCallback(() => {
    stopRecording()
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    
    setAudioUrl(null)
    setAudioBlob(null)
    setRecordingTime(0)
    
    if (onCancel) {
      onCancel()
    }
  }, [audioUrl, onCancel])
  
  const handleSubmit = useCallback(async () => {
    if (!audioBlob) return
    
    try {
      setIsSubmitting(true)
      await onRecordingComplete(audioBlob)
      
      // Limpar após envio bem-sucedido
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      
      setAudioUrl(null)
      setAudioBlob(null)
      setRecordingTime(0)
    } catch (err) {
      console.error('Erro ao enviar áudio:', err)
      setError('Falha ao enviar o áudio. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }, [audioBlob, audioUrl, onRecordingComplete])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  if (error) {
    return (
      <div className={`text-sm text-red-500 ${className}`}>
        <p>{error}</p>
        <Button variant="outline" size="sm" onClick={() => setError(null)} className="mt-2">
          Tentar novamente
        </Button>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!isRecording && !audioBlob && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={startRecording}
          aria-label="Gravar áudio"
          className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Mic className="h-5 w-5" />
        </Button>
      )}
      
      {isRecording && (
        <>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
            <div className="animate-pulse h-2 w-2 rounded-full bg-red-500" />
            <span className="text-sm font-medium">
              {formatTime(recordingTime)}/{formatTime(maxDurationSeconds)}
            </span>
            <Progress 
              value={(recordingTime / maxDurationSeconds) * 100} 
              className="w-24 h-1" 
            />
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={stopRecording}
            aria-label="Parar gravação"
            className="rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Square className="h-5 w-5" />
          </Button>
        </>
      )}
      
      {audioBlob && !isRecording && (
        <>
          <audio
            src={audioUrl || undefined}
            controls
            className="h-8 max-w-[180px] rounded"
          />
          
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={cancelRecording}
              aria-label="Cancelar"
              className="rounded-full text-gray-500 hover:text-red-500"
            >
              <Trash className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={handleSubmit}
              disabled={isSubmitting}
              aria-label="Enviar áudio"
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
} 