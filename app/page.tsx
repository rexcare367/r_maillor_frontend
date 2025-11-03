'use client'

import { useCoins } from "@/hooks/useCoins"
import AlertSlider from "@/features/dashboard/AlertSlider"
import StatsSection from "@/features/dashboard/StatsSection"
import CoinListing from "@/components/CoinListing"

export default function MeillorDashboard() {
  const { loading, pagination } = useCoins({ page: 1, limit: 25 })

  const handleBuy = (coinId: string) => {
    console.log('Buying coin:', coinId)
    // Add your buy logic here
  }

  return (
    <div >
      {/* Stats Section */}
      <StatsSection loading={loading} totalCoins={pagination?.total || 0} />

      {/* Alert Slider */}
      <AlertSlider />

      {/* Coin Listing */}
      <CoinListing onBuy={handleBuy} />
    </div>
  )
}
