'use client';

/**
 * Breadcrumbs.tsx
 * 
 * Componente de navegação que mostra a hierarquia de páginas atual.
 * Transforma o caminho URL em links de navegação para facilitar o retorno.
 */

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbsProps {
  /** Título exibido para a raiz da navegação (primeiro item) */
  rootLabel?: string
  /** Caminho base para prefixar nos links de navegação */
  basePath?: string
  /** Classes CSS adicionais para o container */
  className?: string
  /** Ocultar item inicial (home) */
  hideHome?: boolean
  /** Sobrescrever segmentos para nomes amigáveis */
  segmentLabels?: Record<string, string>
}

export function Breadcrumbs({
  rootLabel = 'Início',
  basePath = '',
  className,
  hideHome = false,
  segmentLabels = {},
}: BreadcrumbsProps) {
  const pathname = usePathname() || ''
  
  // Remove query params e trailing slash
  const cleanPath = pathname.split('?')[0].replace(/\/$/, '')
  
  // Filtra partes do caminho para remover segmentos de grupo como (communication)
  const pathSegments = cleanPath.split('/').filter(segment => 
    segment !== '' && !segment.includes('(') && !segment.includes(')')
  )

  // Cria os items de navegação
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Constrói o link para este nível de navegação
    const href = basePath + '/' + pathSegments.slice(0, index + 1).join('/')
    
    // Usa o label personalizado ou formata o segmento
    // Substituindo hifens e underscores por espaços e capitalizando a primeira letra
    const defaultLabel = segment
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
    
    const label = segmentLabels[segment] || defaultLabel
    
    return { href, label }
  })

  // Se não houver segmentos de caminho (estamos na raiz), não exibir breadcrumbs
  if (breadcrumbItems.length === 0 && hideHome) {
    return null
  }

  return (
    <nav aria-label="Breadcrumbs" className={cn("flex text-sm", className)}>
      <ol className="flex items-center flex-wrap">
        {!hideHome && (
          <li className="flex items-center">
            <Link 
              href="/"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only">{rootLabel}</span>
            </Link>
            {breadcrumbItems.length > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60" />
            )}
          </li>
        )}
        
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          
          return (
            <li key={item.href} className="flex items-center">
              {isLast ? (
                <span className="font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link 
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
} 