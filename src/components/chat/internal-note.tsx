'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StickyNote, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface InternalNoteProps {
  conversationId: string
  currentUser: {
    id: string
    name: string
    avatar?: string
  }
  onAddNote: (note: string, conversationId: string) => Promise<void>
}

export interface Note {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    name: string
    avatar?: string
  }
}

interface NoteListProps {
  notes: Note[]
  onDelete?: (noteId: string) => Promise<void>
}

function NoteList({ notes, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-gray-500">
        Nenhuma anotação interna para esta conversa
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <Card key={note.id} className="p-3 bg-yellow-50 border-yellow-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-yellow-200 text-yellow-700 text-xs">
                  {note.author.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
                {note.author.avatar && (
                  <AvatarImage src={note.author.avatar} alt={note.author.name} />
                )}
              </Avatar>
              <div>
                <p className="text-xs font-medium">{note.author.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-red-500"
                onClick={() => onDelete(note.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-sm whitespace-pre-wrap">{note.content}</p>
        </Card>
      ))}
    </div>
  )
}

export function InternalNote({ conversationId, currentUser, onAddNote }: InternalNoteProps) {
  const [note, setNote] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddNote = async () => {
    if (!note.trim()) return
    
    try {
      setIsLoading(true)
      await onAddNote(note, conversationId)
      
      // Simular adição de nota para demonstração
      const newNote: Note = {
        id: `note-${Date.now()}`,
        content: note,
        createdAt: new Date(),
        author: currentUser
      }
      
      setNotes([newNote, ...notes])
      setNote('')
    } catch (error) {
      console.error('Erro ao adicionar anotação:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      // Implementar a lógica real de exclusão aqui
      setNotes(notes.filter(note => note.id !== noteId))
    } catch (error) {
      console.error('Erro ao excluir anotação:', error)
    }
  }

  return (
    <div className="my-2">
      <div className="mb-2 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1 border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <StickyNote className="h-3 w-3" />
          {isExpanded ? 'Ocultar anotações' : 'Anotações internas'}
        </Button>
        <span className="text-xs text-gray-500">
          Visível apenas para equipe interna
        </span>
      </div>

      {isExpanded && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
          <div className="mb-3">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Adicione uma anotação interna sobre esta conversa..."
              className="min-h-[80px] resize-none border-yellow-200 bg-white text-sm"
            />
            <div className="mt-2 flex justify-end">
              <Button
                variant="default"
                size="sm"
                disabled={!note.trim() || isLoading}
                onClick={handleAddNote}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Adicionar anotação
              </Button>
            </div>
          </div>
          
          <NoteList notes={notes} onDelete={handleDeleteNote} />
        </div>
      )}
    </div>
  )
} 