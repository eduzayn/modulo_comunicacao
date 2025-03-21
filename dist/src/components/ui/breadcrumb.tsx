'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mapeamento de títulos de rota
const routeTitles: Record<string, string> = {
  'inbox': 'Caixa de Entrada',
  'crm': 'CRM',
  'reports': 'Relatórios',
  'settings': 'Configurações',
  'help': 'Ajuda',
  'channels': 'Canais',
  'widget': 'Widget',
  'courses': 'Cursos',
  'pipelines': 'Pipelines',
  'bots': 'Bots',
  'workflows': 'Fluxos de Trabalho',
  'automations': 'Automações',
  'assignment-rules': 'Regras de Atribuição',
  'knowledge-base': 'Base de Conhecimento',
  'business-hours': 'Horários',
  'tags': 'Tags',
  'quick-phrases': 'Frases Rápidas',
  'custom-fields': 'Campos Personalizados',
  'groups': 'Equipes',
  'account': 'Conta',
  'dashboard': 'Dashboard',
  'deals': 'Negociações',
  'tasks': 'Tarefas',
  'contacts': 'Contatos',
  'campaigns': 'Campanhas',
  'goals': 'Metas',
  'overview': 'Visão Geral',
  'productivity': 'Produtividade',
  'attribution': 'Atribuição',
  'evaluation': 'Avaliação',
  'communication': 'Comunicação',
  'messages': 'Mensagens',
  'chat': 'Chat',
  'student': 'Estudantes',
  'content': 'Conteúdo',
  'enrollment': 'Matrículas',
  'stats': 'Estatísticas',
  'login': 'Login',
  'integrations': 'Integrações',
  'billing': 'Faturamento',
  'new': 'Novo',
  'sales': 'Vendas',
  'support': 'Suporte',
  'unassigned': 'Não atribuídas',
  'resolved': 'Resolvidas',
  'filter': 'Filtro',
  'create': 'Criar',
  'edit': 'Editar',
  'view': 'Visualizar'
}

// Tipos de props para os componentes
interface BreadcrumbItemProps {
  href?: string
  isLast?: boolean
  children: React.ReactNode
  className?: string
}

interface BreadcrumbsProps {
  homeHref?: string
  showHome?: boolean
  className?: string
  items?: Array<{
    href: string
    label: string
  }>
}

// Componente individual de item do breadcrumb
const BreadcrumbItem = ({
  href,
  isLast,
  children,
  className,
}: BreadcrumbItemProps) => {
  if (isLast) {
    return (
      <li className={cn("flex items-center text-sm font-medium text-foreground", className)}>
        <span>{children}</span>
      </li>
    )
  }

  return (
    <li className={cn("flex items-center text-sm font-medium", className)}>
      <Link 
        href={href || '#'} 
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {children}
      </Link>
      <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
    </li>
  )
}

// Função para processar parâmetros de consulta
const processQueryParams = (segment: string, fullPath: string) => {
  if (segment.startsWith('?')) {
    const params = new URLSearchParams(segment)
    const filterParam = params.get('filter')
    if (filterParam && routeTitles[filterParam]) {
      return routeTitles[filterParam]
    }
    // Se tivermos outros parâmetros importantes, podemos processá-los aqui
    return null // Ignorar se não for um parâmetro relevante
  }
  return null
}

// Componente principal de breadcrumbs
export function Breadcrumb({
  homeHref = '/',
  showHome = true,
  className,
  items = [],
}: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Gerar caminhos do breadcrumb a partir do pathname se não fornecidos como props
  const breadcrumbItems = items.length > 0 
    ? items 
    : pathname
        .split('/')
        .filter(Boolean)
        .reduce((acc: Array<{href: string, label: string}>, segment, index, segments) => {
          // Ignorar segmentos vazios
          if (!segment) return acc
          
          // Verificar se é um parâmetro de consulta
          if (segment.includes('?')) {
            const [path, query] = segment.split('?')
            const segmentWithoutQuery = path
            
            if (segmentWithoutQuery) {
              const href = `/${segments.slice(0, index).join('/')}/${segmentWithoutQuery}`
              const label = routeTitles[segmentWithoutQuery] || segmentWithoutQuery.charAt(0).toUpperCase() + segmentWithoutQuery.slice(1)
              acc.push({ href, label })
            }
            
            // Processar parâmetros de consulta
            const queryParams = new URLSearchParams(`?${query}`)
            queryParams.forEach((value, key) => {
              if (key === 'filter' && routeTitles[value]) {
                acc.push({ 
                  href: `/${segments.slice(0, index + 1).join('/')}?${key}=${value}`,
                  label: routeTitles[value]
                })
              }
            })
            
            return acc
          }
          
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const label = routeTitles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
          acc.push({ href, label })
          
          return acc
        }, [])

  return (
    <nav className={cn("mb-4", className)} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        {showHome && (
          <BreadcrumbItem href={homeHref}>
            <Home className="h-4 w-4" />
          </BreadcrumbItem>
        )}
        
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem 
            key={item.href} 
            href={item.href}
            isLast={index === breadcrumbItems.length - 1}
          >
            {item.label}
          </BreadcrumbItem>
        ))}
      </ol>
    </nav>
  )
} 