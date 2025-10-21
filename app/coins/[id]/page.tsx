'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CoinDetail from '@/features/coins/CoinDetail'
import Loading from '@/components/Loading'
import Error from '@/components/Error'
import { coinsApi, type Coin } from '@/lib/api/coins'

export default function CoinDetailPage() {
  const params = useParams()
  const coinId = params.id as string
  const [coin, setCoin] = useState<Coin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch coin from backend API
        const data = await coinsApi.getCoinById(coinId)
        setCoin(data)
      } catch (err) {
        const error = err as Error
        setError(error?.message || 'Impossible de charger les détails de la pièce')
        console.error('Error fetching coin:', error)
      } finally {
        setLoading(false)
      }
    }

    if (coinId) {
      fetchCoin()
    }
  }, [coinId])

  const handleBuy = (coinId: string) => {
    console.log('Buy coin:', coinId)
    // TODO: Implement buy functionality
  }

  const handleFollow = (coinId: string) => {
    console.log('Follow coin:', coinId)
    // TODO: Implement follow functionality
  }

  const handleRetry = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading message="Chargement des détails de la pièce..." />
      </div>
    )
  }

  if (error || !coin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Error 
          message={error ?? 'Pièce introuvable'} 
          title="Erreur de chargement"
          onRetry={handleRetry}
          showCard
        />
      </div>
    )
  }

  return (
    <CoinDetail 
      coin={coin}
      onBuy={handleBuy}
      onFollow={handleFollow}
    />
  )
}

