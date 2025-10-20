'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
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

  // Handler functions for coin actions
  const handleAnalyze = (coinId: string) => {
    console.log('Analyzing coin:', coinId)
    // Add your analyze logic here
  }

  const handleBuy = (coinId: string) => {
    console.log('Buying coin:', coinId)
    // Add your buy logic here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Meillor</h1>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="default">
                Se connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button size="default" className="bg-black hover:bg-black/90">
                Devenir Membre
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <StatsSection loading={loading} totalCoins={pagination?.total || 0} />

        {/* Alert Slider */}
        <AlertSlider />

        {/* Top Or Section */}
        <div>
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
                  onAnalyze={handleAnalyze}
                  onBuy={handleBuy}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
