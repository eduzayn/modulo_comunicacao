'use client'

import { useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X, File, Image, FileText, Music, Video, Package } from 'lucide-react'
import { Button } from './button'
import { Progress } from './progress'

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
  onFileRemoved?: (file: File) => void
  maxFiles?: number
  maxSize?: number // em bytes
  accept?: Record<string, string[]>
  disabled?: boolean
  className?: string
}

export function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) {
    return <Image className="h-6 w-6 text-blue-500" />
  } else if (fileType.startsWith('text/')) {
    return <FileText className="h-6 w-6 text-gray-500" />
  } else if (fileType.startsWith('audio/')) {
    return <Music className="h-6 w-6 text-purple-500" />
  } else if (fileType.startsWith('video/')) {
    return <Video className="h-6 w-6 text-red-500" />
  } else if (fileType.includes('pdf')) {
    return <FileText className="h-6 w-6 text-red-500" />
  } else if (fileType.includes('word') || fileType.includes('document')) {
    return <FileText className="h-6 w-6 text-blue-700" />
  } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
    return <FileText className="h-6 w-6 text-green-600" />
  } else {
    return <Package className="h-6 w-6 text-gray-500" />
  }
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function FileUploader({
  onFilesSelected,
  onFileRemoved,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB padrão
  accept,
  disabled = false,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [uploading, setUploading] = useState(false)
  
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
      
      // Simular progresso de upload para demonstração
      const newProgress = { ...progress }
      acceptedFiles.forEach((file) => {
        newProgress[file.name] = 0
        simulateProgress(file.name)
      })
      
      setFiles(newFiles)
      setProgress(newProgress)
      onFilesSelected(newFiles)
    },
    maxFiles: maxFiles - files.length,
    maxSize,
    accept,
    disabled
  })
  
  const simulateProgress = (fileName: string) => {
    setUploading(true)
    let percent = 0
    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 10)
      if (percent >= 100) {
        percent = 100
        clearInterval(interval)
        setProgress(prev => ({ ...prev, [fileName]: percent }))
        
        // Verificar se todos os arquivos foram "carregados"
        const allComplete = Object.values({ ...progress, [fileName]: percent }).every(
          (val) => val === 100
        )
        
        if (allComplete) {
          setTimeout(() => {
            setUploading(false)
          }, 500)
        }
      } else {
        setProgress(prev => ({ ...prev, [fileName]: percent }))
      }
    }, 200)
  }
  
  const handleRemoveFile = (file: File) => {
    const updatedFiles = files.filter((f) => f !== file)
    setFiles(updatedFiles)
    
    if (onFileRemoved) {
      onFileRemoved(file)
    }
    
    // Se todos os arquivos foram removidos, redefina o estado de upload
    if (updatedFiles.length === 0) {
      setUploading(false)
      setProgress({})
    }
  }
  
  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive 
            ? 'Solte os arquivos aqui...' 
            : `Arraste e solte arquivos aqui, ou clique para selecionar`}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {maxFiles > 1 
            ? `Máximo de ${maxFiles} arquivos` 
            : 'Apenas 1 arquivo'}
          {' '}<span className="text-gray-400">·</span>{' '}
          Máximo de {formatFileSize(maxSize)}
        </p>
        
        {fileRejections.length > 0 && (
          <div className="mt-2 text-xs text-red-500">
            {fileRejections.map(({ file, errors }) => (
              <p key={file.name}>
                {file.name}: {errors.map(e => e.message).join(', ')}
              </p>
            ))}
          </div>
        )}
      </div>
      
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="bg-gray-50 rounded-md p-2 flex items-center">
              <div className="mr-2">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                {progress[file.name] !== undefined && progress[file.name] < 100 && (
                  <Progress value={progress[file.name]} className="h-1 mt-1" />
                )}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-gray-400 hover:text-red-500"
                onClick={() => handleRemoveFile(file)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 