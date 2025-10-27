'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AlertSlider from '@/features/dashboard/AlertSlider';
import StatsSection from '@/features/dashboard/StatsSection';
import CoinListing from '@/components/CoinListing';
import { useCoins } from '@/hooks/useCoins';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { loading, pagination } = useCoins({ page: 1, limit: 25 });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleBuy = (coinId: string) => {
    console.log('Buying coin:', coinId);
    // Add your buy logic here
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover and collect rare coins with Meillor
        </p>
      </div>

      {/* Stats Section */}
      <StatsSection loading={loading} totalCoins={pagination?.total || 0} />

      {/* Alert Slider */}
      <AlertSlider />

      {/* Coin Listing */}
      <CoinListing onBuy={handleBuy} />
    </div>
  );
}