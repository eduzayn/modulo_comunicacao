'use client'

import { Button } from '@/components/ui/button'
import { CustomFieldList } from './components/custom-field-list'
import { useRouter } from 'next/navigation'

export default function CustomFieldsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Campos personalizados</h1>
          <p className="text-sm text-muted-foreground">
            Crie campos personalizados para gravar as informações que você precisa.
            Por exemplo, crie um campo de CPF, CNPJ, endereço, ou o que mais sua empresa precisar registrar dos seus clientes.
          </p>
        </div>
        <Button onClick={() => router.push('/settings/custom-fields/new')}>
          + Novo campo
        </Button>
      </div>

      <div className="mt-4">
        <CustomFieldList />
      </div>
    </div>
  )
} 