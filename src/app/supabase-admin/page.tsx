'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function SupabaseAdminPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFunctions = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/supabase')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao buscar dados')
      }
      
      const data = await response.json()
      setResult(data.functions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const executeSqlQuery = async () => {
    // Esta função seria usada com um formulário para executar consultas SQL
    // customizadas via API POST
    setLoading(true)
    setError(null)
    
    try {
      const query = `
        SELECT n.nspname AS schema,
        p.proname AS function_name,
        pg_catalog.pg_get_function_result(p.oid) AS return_type,
        pg_catalog.pg_get_function_arguments(p.oid) AS arguments
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
        ORDER BY function_name
        LIMIT 10;
      `
      
      const response = await fetch('/api/supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao executar consulta')
      }
      
      const data = await response.json()
      setResult(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Admin</h1>
      
      <div className="mb-6 flex space-x-4">
        <Button onClick={fetchFunctions} disabled={loading}>
          {loading ? 'Carregando...' : 'Buscar Funções SQL'}
        </Button>
        
        <Button onClick={executeSqlQuery} disabled={loading} variant="outline">
          {loading ? 'Carregando...' : 'Executar Consulta Exemplo'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-white shadow-md rounded-lg p-4 overflow-auto max-h-[70vh]">
          <h2 className="text-xl font-semibold mb-3">Resultados</h2>
          
          {Array.isArray(result) ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(result[0] || {}).map((key) => (
                    <th 
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value: any, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre className="p-4 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
} 