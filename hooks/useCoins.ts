'use client'

import { useState, useEffect } from 'react'
import { coinsApi, type Coin, type CoinsResponse, type CoinsParams } from '@/lib/api/coins'

export interface UseCoinsReturn {
  coins: Coin[]
  loading: boolean
  error: string | null
  pagination: CoinsResponse['pagination'] | null
  refetch: () => void
}

export function useCoins(params: CoinsParams = {}): UseCoinsReturn {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<CoinsResponse['pagination'] | null>(null)

  const fetchCoins = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await coinsApi.getCoins(params)
      setCoins(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching coins')
      console.error('Error fetching coins:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoins()
  }, [JSON.stringify(params)]) // Re-fetch when params change

  return {
    coins,
    loading,
    error,
    pagination,
    refetch: fetchCoins
  }
}
