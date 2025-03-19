import { BaseLayout } from '@/components/layout/BaseLayout'
import { ReactNode } from 'react'

export default function CommunicationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        {children}
      </div>
    </div>
  )
}
