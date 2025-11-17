'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Search, ShoppingCart } from "lucide-react"
import { CountryFlag } from "./CountryFlag"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface CoinListItemProps {
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
  }
  onBuy?: (coinId: string) => void
  onToggleFavorite?: (coinId: string, isFavorite: boolean) => void
}

export default function CoinListItem({ coin, onBuy, onToggleFavorite }: CoinListItemProps) {
  const { user } = useAuth()
  const router = useRouter()
  const premium = coin.premium || Math.random() * 5 + 1
  const investmentScore = coin.ai_score || Math.floor(Math.random() * 40) + 60
  const scoreColor = investmentScore >= 80 ? 'text-green-600' : 'text-purple-600'

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
    <Card className="bg-white rounded-lg overflow-hidden hover:bg-gold-50 hover:border-gold-400">
      <div className="flex items-center gap-6 p-4">
        {/* Ranking and Score */}
        <div className="flex flex-col items-center gap-1 w-16 flex-shrink-0">
          <span className="text-sm text-gray-600 font-medium">#{coin.ranking || 1}</span>
          <div className={`text-xl font-bold ${scoreColor}`}>
            {investmentScore}
          </div>
        </div>
        
        {/* Coin Image - Medium */}
        <div className="w-20 h-20 flex-shrink-0 cursor-pointer" onClick={handleCoinClick}>
          <img 
            src={coin.front_picture_url || "/placeholder.svg"} 
            alt={coin.name} 
            className="w-full h-full object-contain rounded-full" 
          />
        </div>
        
        {/* Coin Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 cursor-pointer" onClick={handleCoinClick}>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-amber-800 truncate">{coin.name}</h3>
                <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600 font-semibold text-xs">
                  Unique
                </Badge>
              </div>
              <p className="text-sm text-gray-600 truncate">{coin.sub_name}</p>
            </div>
          </div>
          
          {/* Specs Row */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CountryFlag 
                country={coin.storage_country || coin.origin_country || "Suisse"} 
                size="md"
              />
            </div>
            <span>{coin.year || "N/A"}</span>
            <span>•</span>
            <span>{coin.condition || "N/A"}</span>
            <span>•</span>
            <span>{premium.toFixed(1)}%</span>
          </div>
        </div>
        <div className="flex items-end gap-2 flex-col">
        {user && (
          <button 
            onClick={handleToggleFavorite}
            className="transition-colors"
            aria-label={coin.is_favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star 
              className={`w-5 h-5 cursor-pointer transition-colors flex-shrink-0 ml-2 ${
                coin.is_favorite 
                  ? 'text-yellow-400 stroke-yellow-400 fill-yellow-400 hover:text-yellow-500 hover:fill-yellow-500' 
                  : 'text-gray-400 stroke-gray-400 fill-none hover:text-yellow-400 hover:fill-yellow-200'
              }`} 
            />
          </button>
        )}
        
        {/* Price Info */}
        <div className="flex flex-col items-end gap-1 w-24 ">
          <div className="text-xl font-bold text-black">{coin.price_eur}€</div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {coin.is_sold ? (
            <div className="text-center py-2 text-gray-500 font-medium text-sm w-full">
              ACHETÉ
            </div>
          ) : (
            <>
              <Link href={`/coins/${coin.id}`}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs rounded-full border-purple-600 text-purple-600 hover:bg-gold-500 hover:text-black hover:border-gold-600"
                >
                  <Search className="w-3 h-3 mr-1" />
                  Analyser
                </Button>
              </Link>
              <Button 
                size="sm" 
                className="flex-1 bg-black text-white hover:bg-gold-500 hover:text-black rounded-full text-xs"
                onClick={handleBuy}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Acheter
              </Button>
            </>
          )}
        </div>
        </div>
      </div>
    </Card>
  )
}
