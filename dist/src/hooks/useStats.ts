import { useState, useEffect } from 'react'
import { Stats, getStats, getStatsRealtime } from '@/services/stats'

export function useStats(period: 'day' | 'week' | 'month' = 'week') {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getStats(period)
        setStats(data)
      } catch (err) {
        setError('Erro ao carregar estatísticas')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [period])

  useEffect(() => {
    const subscription = getStatsRealtime()
    return () => {
      subscription.then(sub => sub.unsubscribe())
    }
  }, [])

  return {
    stats,
    isLoading,
    error
  }
} 