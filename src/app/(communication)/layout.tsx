import { BaseLayout } from '@/components/layout/BaseLayout'
import { ReactNode } from 'react'

export default function CommunicationLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <BaseLayout module="communication">
      {children}
    </BaseLayout>
  )
}
