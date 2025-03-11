'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { SmileIcon } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘']
  },
  {
    name: 'Gestures',
    emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖']
  },
  {
    name: 'Objects',
    emojis: ['💻', '📱', '📞', '📠', '📟', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌚', '📷']
  },
  {
    name: 'Symbols',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟']
  }
];

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <Button 
        type="button" 
        size="icon" 
        variant="ghost"
        className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SmileIcon className="h-5 w-5" />
        <span className="sr-only">Emojis</span>
      </Button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2 border-b border-gray-200">
            <div className="flex space-x-2">
              {EMOJI_CATEGORIES.map((category, index) => (
                <button
                  key={category.name}
                  className={`p-1 rounded-md ${activeCategory === index ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory(index)}
                >
                  {category.emojis[0]}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-2 h-48 overflow-y-auto">
            <h3 className="text-xs font-medium text-gray-500 mb-2">{EMOJI_CATEGORIES[activeCategory].name}</h3>
            <div className="grid grid-cols-7 gap-1">
              {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
                <button
                  key={emoji}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
