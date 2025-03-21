'use client';

import { useMemo } from 'react';
import { Tag } from '../types';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tag: Tag;
  onClick?: (tagId: string) => void;
  className?: string;
  showCount?: boolean;
  count?: number;
  removable?: boolean;
  onRemove?: (tagId: string) => void;
}

export function TagBadge({ 
  tag, 
  onClick, 
  className, 
  showCount = false, 
  count = 0, 
  removable = false, 
  onRemove 
}: TagBadgeProps) {
  // Calcular cores de texto baseadas na cor de fundo da tag
  const textColor = useMemo(() => {
    // Converter hex para RGB
    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    // Calcular contraste usando fórmula de luminância
    const getContrastColor = (hexColor: string): 'text-white' | 'text-black' => {
      const rgb = hexToRgb(hexColor);
      if (!rgb) return 'text-black';

      const { r, g, b } = rgb;
      // Calcular luminância usando fórmula padrão
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Retornar cor de texto baseada na luminância (preto para cores claras, branco para escuras)
      return luminance > 0.5 ? 'text-black' : 'text-white';
    };

    return getContrastColor(tag.color);
  }, [tag.color]);

  const handleClick = () => {
    if (onClick) {
      onClick(tag.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tag.id);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        onClick ? 'cursor-pointer hover:opacity-80' : '',
        textColor,
        className
      )}
      style={{ backgroundColor: tag.color }}
      onClick={onClick ? handleClick : undefined}
    >
      <span>{tag.name}</span>
      
      {showCount && count > 0 && (
        <span className="ml-1 rounded-full bg-black/10 px-1.5 py-0.5">
          {count}
        </span>
      )}
      
      {removable && (
        <button
          onClick={handleRemove}
          className={cn(
            'ml-1 rounded-full p-0.5 hover:bg-black/20',
            textColor
          )}
          aria-label="Remover tag"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
} 