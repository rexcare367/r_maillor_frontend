'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Search, ShoppingCart } from "lucide-react"
import { CountryFlag } from "./CountryFlag"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface CoinCardItemProps {
  coin: {
    id: string
    name: string
    sub_name?: string
    front_picture_url?: string
    price_eur: number
    target_price?: number
    ai_score?: number
    year?: number
    condition?: string
    premium?: number
    delivery?: boolean
    storage_country?: string
    lsp?: boolean
    taxation?: string
    is_sold?: boolean
    origin_country?: string
    ranking?: number
    is_favorite?: boolean
    product_url?: string
    updated_at?: string | null
    scraped_at?: string
  }
  onBuy?: (coinId: string) => void
  onToggleFavorite?: (coinId: string, isFavorite: boolean) => void
}

export default function CoinCardItem({ coin, onBuy, onToggleFavorite }: CoinCardItemProps) {
  const { user } = useAuth()
  const router = useRouter()
  const premium = coin.premium || Math.random() * 5 + 1
  const investmentScore = coin.ai_score || Math.floor(Math.random() * 40) + 60
  const scoreColor = investmentScore >= 80 ? 'text-green-600' : 'text-purple-600'

  // Format last update time
  const formatLastUpdate = () => {
    const updateTime = coin.updated_at || coin.scraped_at
    if (!updateTime) return null

    const updateDate = new Date(updateTime)
    const now = new Date()
    const diffMs = now.getTime() - updateDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    
    // For older dates, show formatted date
    return updateDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: diffDays >= 365 ? 'numeric' : undefined
    })
  }

  const lastUpdate = formatLastUpdate()

  const handleToggleFavorite = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    onToggleFavorite?.(coin.id, !coin.is_favorite)
  }

  const handleCoinClick = () => {
    if (!user) {
      router.push('/auth/login')
    } else {
      router.push(`/coins/${coin.id}`)
    }
  }

  const handleBuy = () => {
    if (!user) {
      router.push('/auth/login')
    } else if (coin.product_url) {
      window.open(coin.product_url, '_blank')
    } else {
      onBuy?.(coin.id)
    }
  }

  return (
    <Card className="bg-white rounded-lg overflow-hidden p-6 max-w-sm">
      {/* Top Section */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-gray-800">#{coin.ranking || 1}</span>
        <div className={`text-xl font-bold ${scoreColor}`}>
          {investmentScore}/100
        </div>
        {user && (
          <button 
            onClick={handleToggleFavorite}
            className="transition-colors"
            aria-label={coin.is_favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star 
              className={`w-5 h-5 cursor-pointer transition-colors ${
                coin.is_favorite 
                  ? 'text-yellow-400 stroke-yellow-400 fill-yellow-400 hover:text-yellow-500 hover:fill-yellow-500' 
                  : 'text-gray-400 stroke-gray-400 fill-none hover:text-yellow-400 hover:fill-yellow-200'
              }`} 
            />
          </button>
        )}
      </div>

      {/* Coin Title and Subtitle */}
      <div className="text-center cursor-pointer" onClick={handleCoinClick}>
        <div className="flex items-center justify-center gap-2 flex-wrap mb-1">
          <h3 className="text-xl font-bold text-amber-800">{coin.name}</h3>
          <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600 font-semibold text-xs">
            Unique
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{coin.sub_name}</p>
      </div>

      {/* Coin Image */}
      <div className="flex justify-center cursor-pointer" onClick={handleCoinClick}>
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img 
            src={coin.front_picture_url || "/placeholder.svg"} 
            alt={coin.name} 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

      {/* Price Information */}
      <div className="text-center">
        <div className="text-2xl font-bold text-black mb-1">{coin.price_eur}€</div>
        <div className="text-sm text-green-600">
          Objectif de prix : {coin.target_price || Math.round(coin.price_eur * 1.1)}€
        </div>
      </div>

      {/* Separator Line */}
      <hr className="border-gray-200 mb-4" />

      {/* Detailed Specifications */}
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-row gap-2 justify-evenly">
          <div className="space-y-1">
            <div className="text-gray-600">Année</div>
            <div className="font-bold text-black">{coin.year || "N/A"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Etat</div>
            <div className="font-bold text-black">{coin.condition || "N/A"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Prime</div>
            <div className="font-bold text-black">{premium.toFixed(2)}%</div>
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-evenly">
          <div className="space-y-1">
            <div className="text-gray-600">Livraison</div>
            <div className="font-bold text-black">{coin.delivery ? "Oui" : "Non"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Stockage</div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-black">{coin.storage_country || coin.origin_country || "N/A"}</span>
              {(coin.storage_country || coin.origin_country) && (
                <CountryFlag 
                  country={coin.storage_country || coin.origin_country || ""} 
                  size="sm"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-evenly">
          <div className="space-y-1">
          <div className="text-gray-600">LSP</div>
          <div className="font-bold text-black">{coin.lsp ? "Oui" : "Non"}</div>
          </div>
          <div className="space-y-1 col-span-2">
            <div className="text-gray-600">Fiscalité</div>
            <div className="font-bold text-black">{coin.taxation || "Cours légaux"}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {coin.is_sold ? (
        <div className="text-center py-3 text-gray-500 font-medium">
          ACHETÉ
        </div>
      ) : (
        <div className="flex gap-3">
          <Link href={`/coins/${coin.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full text-sm rounded-lg border-blue-600 text-blue-600 hover:bg-gold-500 hover:text-black hover:border-gold-500"
            >
              <Search className="w-3 h-3 mr-1" />
              Analyser
            </Button>
          </Link>
          <Button 
            className="flex-1 bg-black hover:bg-gold-500 hover:text-black text-white text-sm rounded-lg"
            onClick={handleBuy}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Acheter
          </Button>
        </div>
      )}

      {/* Last Update Time - Bottom Center */}
      {lastUpdate && (
        <div className="text-center mt-3">
          <span className="text-xs text-gray-500">Mis à jour {lastUpdate}</span>
        </div>
      )}
    </Card>
  )
}
