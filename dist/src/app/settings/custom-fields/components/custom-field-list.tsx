'use client'

import { useCustomFields } from '../hooks/use-custom-fields'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { CustomField } from '../types'

export function CustomFieldList() {
  const { data: fields, isLoading } = useCustomFields()
  const [search, setSearch] = useState('')

  const filteredFields = fields?.filter((field) =>
    field.name.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Pesquisar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {!filteredFields?.length ? (
        <div className="flex items-center justify-center rounded-lg border p-8">
          <p className="text-muted-foreground">
            {search
              ? 'Nenhum campo encontrado'
              : 'Nenhum campo personalizado criado ainda'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFields.map((field) => (
            <CustomFieldItem key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  )
}

function CustomFieldItem({ field }: { field: CustomField }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <span className="font-medium">{field.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground capitalize">
          {field.type}
        </span>
        <span className="text-sm text-muted-foreground capitalize">
          {field.entity}
        </span>
      </div>
    </div>
  )
} 