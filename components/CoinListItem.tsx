'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Search, ShoppingCart } from "lucide-react"
import { CountryFlag } from "./CountryFlag"

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
  }
  onAnalyze?: (coinId: string) => void
  onBuy?: (coinId: string) => void
}

export default function CoinListItem({ coin, onAnalyze, onBuy }: CoinListItemProps) {
  const premium = coin.premium || Math.random() * 5 + 1

  return (
    <Card className="bg-white rounded-lg overflow-hidden">
      <div className="flex items-center gap-6 p-4">
        {/* Coin Image - Medium */}
        <div className="w-20 h-20 flex-shrink-0">
          <img 
            src={coin.front_picture_url || "/placeholder.svg"} 
            alt={coin.name} 
            className="w-full h-full object-contain rounded-full" 
          />
        </div>
        
        {/* Ranking and Score */}
        <div className="flex flex-col items-center gap-1 w-16 flex-shrink-0">
          <span className="text-sm text-gray-600 font-medium">#{coin.ranking || 1}</span>
          <div className="text-lg font-bold text-purple-600">
            {coin.ai_score || Math.floor(Math.random() * 40) + 60}
          </div>
        </div>
        
        {/* Coin Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-amber-800 truncate">{coin.name}</h3>
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
        <Star className="w-5 h-5 text-yellow-400 stroke-yellow-400 fill-none flex-shrink-0 ml-2" />
        
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
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs rounded-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                onClick={() => onAnalyze?.(coin.id)}
              >
                <Search className="w-3 h-3 mr-1" />
                Analyser
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-black hover:bg-black/90 rounded-full text-xs"
                onClick={() => onBuy?.(coin.id)}
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
