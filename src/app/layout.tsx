/**
 * Root layout component for the application
 * 
 * This component provides the base HTML structure and global providers
 * for the entire application.
 */

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sistema Educacional',
  description: 'Sistema integrado de gestão educacional',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
