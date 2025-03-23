'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Button } from './button'
import { Trash2 } from 'lucide-react'

interface UploadAvatarProps {
  defaultImage?: string
  fallback?: string
  onUpload?: (file: File) => void
  onRemove?: () => void
}

export function UploadAvatar({
  defaultImage,
  fallback = 'ZE',
  onUpload,
  onRemove,
}: UploadAvatarProps) {
  const [preview, setPreview] = useState(defaultImage)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        onUpload?.(file)
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: 5242880, // 5MB
    multiple: false,
  })

  const handleRemove = () => {
    setPreview(undefined)
    onRemove?.()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative" {...getRootProps()}>
        <input {...getInputProps()} />
        <Avatar
          className={`h-32 w-32 cursor-pointer transition-opacity ${
            isDragActive ? 'opacity-50' : ''
          }`}
        >
          <AvatarImage src={preview} alt="Avatar" />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute -right-2 -top-2"
            onClick={(e) => {
              e.stopPropagation()
              handleRemove()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Arraste e solte uma foto ou faça Upload
      </p>
      <p className="text-xs text-muted-foreground">
        JPEG/PNG - Min. 100x100px
      </p>
    </div>
  )
} 