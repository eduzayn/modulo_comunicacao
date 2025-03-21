import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Função para combinar classes CSS condicionalmente
 * Usa clsx para processamento condicional e twMerge para resolver conflitos do Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 