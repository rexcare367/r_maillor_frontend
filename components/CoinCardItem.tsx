'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { CountryFlag } from "./CountryFlag"

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
  }
  onAnalyze?: (coinId: string) => void
  onBuy?: (coinId: string) => void
}

export default function CoinCardItem({ coin, onAnalyze, onBuy }: CoinCardItemProps) {
  const premium = coin.premium || Math.random() * 5 + 1

  return (
    <Card className="bg-white rounded-lg overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        {/* Coin Image - Small */}
        <div className="w-16 h-16 flex-shrink-0">
          <img 
            src={coin.front_picture_url || "/placeholder.svg"} 
            alt={coin.name} 
            className="w-full h-full object-contain rounded-full" 
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-amber-800 truncate">{coin.name}</h3>
              <p className="text-xs text-gray-600 truncate">{coin.sub_name}</p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-gray-600">#{coin.ranking || 1}</span>
              <Star className="w-4 h-4 text-yellow-400 stroke-yellow-400 fill-none" />
            </div>
          </div>
          
          {/* Price and Score */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl font-bold text-black">{coin.price_eur}€</div>
            <div className="text-lg font-bold text-purple-600">
              {coin.ai_score || Math.floor(Math.random() * 40) + 60}/100
            </div>
          </div>
          
          {/* Key Specs */}
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
            <span>{coin.year || "N/A"}</span>
            <span>•</span>
            <span>{coin.condition || "N/A"}</span>
            <span>•</span>
            <span>{premium.toFixed(1)}%</span>
            {(coin.storage_country || coin.origin_country) && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <CountryFlag 
                    country={coin.storage_country || coin.origin_country || ""} 
                    size="md"
                  />
                </div>
              </>
            )}
          </div>
          
          {/* Action Buttons */}
          {coin.is_sold ? (
            <div className="text-center py-2 text-gray-500 font-medium text-sm">
              ACHETÉ
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs rounded-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                onClick={() => onAnalyze?.(coin.id)}
              >
                Analyser
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-black hover:bg-black/90 rounded-full text-xs"
                onClick={() => onBuy?.(coin.id)}
              >
                Acheter
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
