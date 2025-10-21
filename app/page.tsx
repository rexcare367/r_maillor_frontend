'use client'

import { useCoins } from "@/hooks/useCoins"
import AlertSlider from "@/features/dashboard/AlertSlider"
import StatsSection from "@/features/dashboard/StatsSection"
import Loading from "@/components/Loading"
import Error from "@/components/Error"
import CoinCard from "@/components/CoinCard"

export default function MeillorDashboard() {
  const { coins, loading, error, pagination } = useCoins({ 
    page: 1, 
    limit: 25,
  })

  const handleBuy = (coinId: string) => {
    console.log('Buying coin:', coinId)
    // Add your buy logic here
  }

  return (
    <div>
      {/* Stats Section */}
      <StatsSection loading={loading} totalCoins={pagination?.total || 0} />

      {/* Alert Slider */}
      <AlertSlider />

      {/* Top Or Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Top Or</h2>
          <div className="text-sm text-muted-foreground">
            {loading ? "Chargement..." : `Mise à jour il y a ${Math.floor(Math.random() * 24)} heures`}
          </div>
        </div>

        {error && (
          <div className="mb-4">
            <Error 
              message={error}
              title="Erreur de chargement"
              onRetry={() => window.location.reload()}
            />
          </div>
        )}

        {loading ? (
          <Loading 
            message="Chargement des pièces..."
            size="md"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-2">
            {coins.map((coin, index) => (
              <CoinCard 
                key={coin.id} 
                coin={{
                  ...coin,
                  ranking: index + 1
                }}
                onBuy={handleBuy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
