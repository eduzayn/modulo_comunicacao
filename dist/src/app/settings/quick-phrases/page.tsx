'use client'

import { Button } from '@/components/ui/button'
import { Plus, Import } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useImportKinboxPhrases } from './hooks/use-quick-phrases'
import { toast } from 'sonner'

export default function QuickPhrasesPage() {
  const router = useRouter()
  const { mutateAsync: importPhrases, isPending } = useImportKinboxPhrases()

  const handleImport = async () => {
    try {
      const result = await importPhrases()
      
      if (result.success && result.data) {
        toast.success(`${result.data.length} frases rápidas importadas com sucesso!`)
      } else {
        toast.error(result.error?.message || 'Erro ao importar frases rápidas')
      }
    } catch (error) {
      console.error('Erro ao importar frases:', error)
      toast.error('Erro ao importar frases rápidas. Tente novamente.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Frases Rápidas</h1>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleImport}
            disabled={isPending}
          >
            <Import className="h-4 w-4 mr-2" />
            {isPending ? 'Importando...' : 'Importar do Kinbox'}
          </Button>

          <Button
            onClick={() => router.push('/settings/quick-phrases/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova frase
          </Button>
        </div>
      </div>

      {/* Lista de frases rápidas aqui */}
    </div>
  )
} 