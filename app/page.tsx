'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, Loader2, ShoppingCart, TrendingUp as ChartUp } from "lucide-react"
import Link from "next/link"
import { useCoins } from "@/hooks/useCoins"

export default function MeillorDashboard() {
  const { coins, loading, error, pagination } = useCoins({ 
    page: 1, 
    limit: 25,
  })

  // Helper function to get country flag
  const getCountryFlag = (country: string) => {
    switch (country.toLowerCase()) {
      case 'france':
        return '🇫🇷'
      case 'suisse':
      case 'switzerland':
        return '🇨🇭'
      default:
        return '🏳️'
    }
  }

  // Helper function to calculate percentage (mock calculation)
  const calculatePercentage = (coin: any) => {
    // This is a mock calculation - replace with actual logic
    console.log('coin', coin)
    return (Math.random() * 10 + 1).toFixed(2) + '%'
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
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="text-center flex-1">
            <div className="text-3xl font-bold" style={{ color: '#0CA111' }}>+9.4%</div>
            <div className="text-sm text-muted-foreground mt-1">ROI prédit</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-foreground">
              {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : pagination?.total || 0}
            </div>
            <div className="text-sm text-muted-foreground mt-1">pièces analysées</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-foreground">0.7K€</div>
            <div className="text-sm text-muted-foreground mt-1">d&apos;or analysé</div>
          </div>
        </div>

        {/* Alert Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-amber-50 border-amber-200 p-4">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-amber-900 mb-1">
                  Nouvelles opportunités disponibles détectées par Meillor IA
                </div>
                <div className="text-sm text-amber-800">-22 pièces à haut potentiel de valorisation</div>
                <div className="text-sm text-amber-800">-3 pièces uniques</div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-200 p-4">
            <div className="flex gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900 mb-1">Analyse de marché par Meillor IA</div>
                <div className="text-sm text-blue-800">-Tendance mensuelle haussière</div>
                <div className="text-sm text-blue-800">-Volume 24h de 200M€</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Or Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Top Or</h2>
            <div className="text-sm text-muted-foreground">
              {loading ? "Chargement..." : `Mise à jour il y a ${Math.floor(Math.random() * 24)} heures`}
            </div>
          </div>

          {error && (
            <Card className="p-6 bg-red-50 border-red-200 mb-4">
              <div className="text-red-800">
                <strong>Erreur:</strong> {error}
              </div>
            </Card>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Chargement des pièces...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {coins.map((coin) => (
                <Card key={coin.id} className="p-6 bg-white border-b-4 border-yellow-200">
                  <div className="flex items-center gap-6">
                    {/* Score */}
                    <div className="text-4xl font-bold text-purple-600 w-16 flex-shrink-0">
                      {coin.ai_score || Math.floor(Math.random() * 40) + 60}
                    </div>

                    {/* Coin Image */}
                    <div className="w-20 h-20 flex-shrink-0 relative">
                      <img 
                        src={coin.front_picture_url || "/placeholder.svg"} 
                        alt={coin.name} 
                        className="object-contain rounded-full" 
                      />
                    </div>

                    {/* Coin Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg mb-1">{coin.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{coin.sub_name}</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-medium px-2 py-1">
                            {getCountryFlag(coin.origin_country)}
                          </Badge>
                          <Badge variant="outline" className="font-medium px-2 py-1">
                            {coin.condition}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{calculatePercentage(coin)}</span>
                        <span className="text-sm text-muted-foreground">{coin.year}</span>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {coin.is_sold ? (
                        <div className="px-6 py-2 text-muted-foreground font-medium">ACHETÉ</div>
                      ) : (
                        <div className="flex items-end gap-3 flex-col">
                          <div className="text-2xl font-bold text-foreground mr-2">{coin.price_eur}€</div>
                          <div className="flex items-center gap-3">
                          <Button 
                            variant="outline" 
                            size="default" 
                            className="rounded-full border-[#3D37E6] text-[#3D37E6] hover:bg-[#3D37E6] hover:text-white"
                          >
                            <ChartUp className="w-4 h-4 mr-2" />
                            ANALYSE
                          </Button>
                          <Button 
                            size="default" 
                            className="bg-black hover:bg-black/90 rounded-full"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Acheter
                          </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
