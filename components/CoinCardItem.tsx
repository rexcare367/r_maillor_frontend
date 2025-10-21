'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Search, ShoppingCart } from "lucide-react"
import { CountryFlag } from "./CountryFlag"
import Link from "next/link"

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
  onBuy?: (coinId: string) => void
}

export default function CoinCardItem({ coin, onBuy }: CoinCardItemProps) {
  const premium = coin.premium || Math.random() * 5 + 1

  return (
    <Card className="bg-white rounded-lg overflow-hidden p-6 max-w-sm">
      {/* Top Section */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-gray-800">#{coin.ranking || 1}</span>
        <div className="text-xl font-bold text-blue-600">
          {coin.ai_score || Math.floor(Math.random() * 40) + 60}/100
        </div>
        <Star className="w-5 h-5 text-gray-400 stroke-gray-400 fill-none hover:text-gold-400 hover:fill-gold-200" />
      </div>

      {/* Coin Title and Subtitle */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-amber-800 mb-1">{coin.name}</h3>
        <p className="text-sm text-gray-600">{coin.sub_name}</p>
      </div>

      {/* Coin Image */}
      <div className="flex justify-center">
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
            onClick={() => onBuy?.(coin.id)}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Acheter
          </Button>
        </div>
      )}
    </Card>
  )
}
