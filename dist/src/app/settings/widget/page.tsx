import { Metadata } from 'next'
import { PageContainer } from '@/components/page-container'
import WidgetSettings from './components/widget-settings'

export const metadata: Metadata = {
  title: 'Configurações de Widget - Kinbox',
  description: 'Configure as opções do widget de chat para seu site'
}

export default function WidgetPage() {
  return (
    <PageContainer
      title="Widget"
      subtitle="Configure as opções do widget de chat para seu site"
    >
      <div className="space-y-6">
        <WidgetSettings />
      </div>
    </PageContainer>
  )
} 