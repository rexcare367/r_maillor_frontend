'use client'

import CoinCardItem from "./CoinCardItem"
import CoinListItem from "./CoinListItem"

interface CoinCardProps {
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

export default function CoinCard({ coin, onAnalyze, onBuy }: CoinCardProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden">
        <CoinCardItem 
          coin={coin}
          onAnalyze={onAnalyze}
          onBuy={onBuy}
        />
      </div>

      {/* Desktop List View */}
      <div className="hidden md:block">
        <CoinListItem 
          coin={coin}
          onAnalyze={onAnalyze}
          onBuy={onBuy}
        />
      </div>
    </>
  )
}
