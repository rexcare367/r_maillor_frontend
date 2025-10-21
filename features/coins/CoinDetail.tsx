'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, RefreshCw, Star } from "lucide-react"
import { CountryFlag } from "@/components/CountryFlag"
import Link from "next/link"
import type { Coin } from "@/lib/api/coins"

interface CoinDetailProps {
  coin: Coin
  onBuy?: (coinId: string) => void
  onFollow?: (coinId: string) => void
}

export default function CoinDetail({ coin, onBuy, onFollow }: CoinDetailProps) {
  // Calculate target price (10% above current price if not provided)
  const targetPrice = coin.price_eur * 1.1
  
  // Map AI score to attributes for display
  const attributes = coin.ai_score 
    ? [
        { name: 'Attribute 1', score: coin.ai_score, level: coin.ai_score >= 80 ? 'Haut' as const : coin.ai_score >= 50 ? 'Moyen' as const : 'Faible' as const },
        { name: 'Att2', score: coin.ai_score >= 80 ? 95 : 75, level: coin.ai_score >= 80 ? 'Haut' as const : 'Moyen' as const },
        { name: 'Att3', score: 70, level: 'Moyen' as const },
        { name: 'Att2', score: 85, level: coin.ai_score >= 80 ? 'Haut' as const : 'Faible' as const },
        { name: 'Att2', score: coin.ai_score >= 80 ? 90 : 60, level: coin.ai_score >= 80 ? 'Haut' as const : 'Faible' as const },
      ]
    : [
        { name: 'Attribute 1', score: 75, level: 'Moyen' as const },
        { name: 'Att2', score: 75, level: 'Moyen' as const },
        { name: 'Att3', score: 70, level: 'Moyen' as const },
        { name: 'Att2', score: 80, level: 'Faible' as const },
        { name: 'Att2', score: 65, level: 'Faible' as const },
      ]

  const getBarColor = (level: string) => {
    switch (level) {
      case 'Haut':
        return 'bg-blue-600'
      case 'Moyen':
        return 'bg-orange-500'
      case 'Faible':
        return 'bg-gray-300'
      default:
        return 'bg-gray-300'
    }
  }

  return (
      <div className="">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm md:text-base text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="md:block hidden font-medium">Retour</span>
        </Link>

        {/* Main Title - Mobile */}
        <div className="flex flex-row justify-between items-center">
        <div className="flex justify-start flex-col mb-4">
          <h1 className="md:text-3xl text-lg font-bold text-gray-900">{coin.name}</h1>
          <p className="md:text-base text-sm text-gray-600">{coin.sub_name}</p>
        </div>
        <Button variant="outline" className="text-sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Recharger
        </Button>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Left Card - Coin Details */}
          <Card className="bg-white rounded-2xl p-6 border border-gray-200 min-w-80">
            {/* Coin Image */}
            <div className="flex justify-center mb-4">
              <img 
                src={coin.front_picture_url || "/placeholder.svg"} 
                alt={coin.name} 
                className="w-48 h-48 object-cover" 
              />
            </div>

            {/* Price Information */}
            <div className="text-center mb-2">
              <div className="text-5xl font-bold text-black mb-2">{coin.price_eur.toFixed(0)}€</div>
              <div className="text-base text-green-600 font-medium">
                Objectif de prix : {Math.round(targetPrice)}€
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="flex flex-col gap-4 text-sm w-full border-t border-gray-700 pt-8">
              <div className="flex flex-row gap-4 justify-between ">
                <div className="space-y-1">
                  <div className="text-gray-500">Année</div>
                  <div className="font-bold text-black">{coin.year}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">État</div>
                  <div className="font-bold text-black">{coin.condition}</div>
                </div>
              <div className="space-y-1">
                <div className="text-gray-500">Prime</div>
                <div className="font-bold text-black">{coin.prime_percent.toFixed(2)}%</div>
              </div>
              </div>

              <div className="flex flex-row gap-4 justify-evenly ">
              <div className="space-y-1">
                <div className="text-gray-500">Livraison</div>
                <div className="font-bold text-black">{coin.is_deliverable ? "Oui" : "Non"}</div>
              </div>
              <div className="space-y-1 col-span-2">
                <div className="text-gray-500">Stockage</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">{coin.vault_location}</span>
                  {coin.vault_location && (
                    <CountryFlag 
                      country={coin.vault_location} 
                      size="sm"
                    />
                  )}
                </div>
              </div>
              </div>
              
              <div className="flex flex-row gap-4 justify-evenly ">
              <div className="space-y-1">
                <div className="text-gray-500">LSP</div>
                <div className="font-bold text-black">{coin.lsp_eligible ? "Oui" : "Non"}</div>
              </div>
              <div className="space-y-1 col-span-2">
                <div className="text-gray-500">Fiscalité</div>
                <div className="font-bold text-black">{coin.taxation}</div>
              </div>
              </div>
              
              <div className="flex flex-row gap-4 justify-evenly ">
              <div className="space-y-1">
                <div className="text-gray-500">Poids brut</div>
                <div className="font-bold text-black">{coin.gross_weight.toFixed(2)}g</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-500">Poids net</div>
                <div className="font-bold text-black">{coin.net_weight.toFixed(2)}g</div>
              </div>
              </div>
            </div>
          </Card>

          {/* Right Card - Investment Score */}
          <Card className="bg-white rounded-2xl p-6 border border-gray-200 w-full">
            {/* Title - Desktop Only */}
            <div className="hidden md:block mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{coin.name}</h1>
              <p className="text-base text-gray-600">{coin.sub_name}</p>
            </div>

            {/* Investment Score */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Score d'investissement</h2>
              
              {/* Score Display */}
              <div className="text-center mb-6">
                <div className="text-7xl font-bold text-blue-600 mb-1">
                  {coin.ai_score ? Math.round(coin.ai_score) : 'N/A'}
                </div>
                <div className="text-base text-gray-500">sur 100</div>
              </div>

              {/* Attributes with Progress Bars */}
              <div className="space-y-3">
                {attributes.map((attr, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <span className="font-medium text-gray-900">{attr.name}</span>
                      <span className="text-gray-600">{attr.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getBarColor(attr.level)} h-2 rounded-full`}
                        style={{ width: `${attr.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <Button 
                variant="outline"
                className="flex-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                onClick={() => onFollow?.(coin.id)}
              >
                <Star className="w-4 h-4 mr-2" />
                Suivre
              </Button>
              <Button 
                className="flex-1 bg-black text-white hover:bg-gold-500 rounded-lg"
                onClick={() => onBuy?.(coin.id)}
              >
                Acheter
              </Button>
            </div>

            {/* Page Views */}
            <div className="text-center text-sm text-gray-500">
              Amount of page views
            </div>
          </Card>
        </div>
      </div>
  )
}

