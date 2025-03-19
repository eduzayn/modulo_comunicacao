/**
 * Root layout component for the application
 * 
 * This component provides the base HTML structure and global providers
 * for the entire application.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

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
      <body className={`font-sans antialiased ${inter.variable}`}>
        {children}
      </body>
    </html>
  )
}
