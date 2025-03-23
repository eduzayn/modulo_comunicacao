'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Smile } from 'lucide-react'
import { ScrollArea } from './scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const EMOJI_CATEGORIES = [
  {
    id: 'frequentlyUsed',
    name: 'Frequentemente Usados',
    emojis: ['👍', '😊', '❤️', '😂', '🙏', '👏', '🔥', '🎉', '👌', '😁']
  },
  {
    id: 'smileys',
    name: 'Smileys & Pessoas',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚']
  },
  {
    id: 'nature',
    name: 'Natureza',
    emojis: ['🌱', '🌲', '🌳', '🌴', '🌵', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙']
  },
  {
    id: 'food',
    name: 'Comida & Bebida',
    emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦']
  },
  {
    id: 'activities',
    name: 'Atividades',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳']
  },
  {
    id: 'objects',
    name: 'Objetos',
    emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥']
  }
]

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEmojis, setFilteredEmojis] = useState<{id: string, name: string, emojis: string[]}[]>(EMOJI_CATEGORIES)
  
  useEffect(() => {
    if (searchQuery) {
      // Filtra emojis baseado na busca (simplificado)
      setFilteredEmojis(
        EMOJI_CATEGORIES.map(category => ({
          ...category,
          emojis: category.emojis.filter(() => Math.random() > 0.5) // Simulação simplificada de busca
        })).filter(category => category.emojis.length > 0)
      )
    } else {
      setFilteredEmojis(EMOJI_CATEGORIES)
    }
  }, [searchQuery])
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost"
          className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Smile className="h-5 w-5" />
          <span className="sr-only">Emojis</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="border-b p-2">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full rounded-md border border-gray-200 p-2 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="frequentlyUsed">
          <TabsList className="flex w-full justify-start overflow-x-auto bg-transparent p-0">
            {filteredEmojis.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="px-2 py-1 text-xs"
              >
                {category.emojis[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {filteredEmojis.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <ScrollArea className="h-40 overflow-y-auto">
                <div className="grid grid-cols-8 gap-1 p-2">
                  {category.emojis.map((emoji, index) => (
                    <button
                      key={`${emoji}-${index}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
                      onClick={() => {
                        onEmojiSelect(emoji)
                        setIsOpen(false)
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  )
} 