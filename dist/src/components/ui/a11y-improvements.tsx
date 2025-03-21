'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface SkipLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
}

export function SkipLink({ href, className, children, ...props }: SkipLinkProps) {
  const [focused, setFocused] = useState(false)

  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:outline-none focus:rounded-md",
        focused ? "opacity-100" : "opacity-0",
        className
      )}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    >
      {children || "Pular para o conteúdo principal"}
    </a>
  )
}

export function AccessibleIcon({ 
  icon: Icon, 
  label, 
  className 
}: { 
  icon: React.ElementType, 
  label: string, 
  className?: string 
}) {
  return (
    <span className={cn("inline-flex", className)} role="img" aria-label={label}>
      <Icon className="h-full w-full" aria-hidden="true" />
    </span>
  )
}

export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

export function HighContrastMode({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="forced-colors:border-[1px] forced-colors:border-solid">
      {children}
    </div>
  )
}

export function LiveRegion({
  children,
  ariaLive = "polite",
  ariaAtomic = "true",
  ariaRelevant = "additions text",
  role = "status",
  className
}: {
  children: React.ReactNode,
  ariaLive?: "polite" | "assertive" | "off",
  ariaAtomic?: "true" | "false",
  ariaRelevant?: "text" | "additions text" | "additions" | "additions removals" | "all" | "removals" | "removals additions" | "removals text" | "text additions" | "text removals",
  role?: string,
  className?: string
}) {
  return (
    <div
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      aria-relevant={ariaRelevant}
      role={role}
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  )
}

export function KeyboardFocusOnly({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      {children}
    </div>
  )
}

export function AccessibilityProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <>
      <div className="text-[0px] absolute top-[-9999px] left-[-9999px]" aria-hidden="true">
        Esta página foi otimizada para acessibilidade
      </div>
      {children}
    </>
  )
} 