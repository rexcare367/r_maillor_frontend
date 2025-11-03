'use client';

import { useState, useEffect } from "react";
import { useCoins } from "@/hooks/useCoins";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import CoinCard from "@/components/CoinCard";
import { favoritesApi } from "@/lib/api/favorites";
import { toast } from "@/hooks/use-toast";

interface CoinListingProps {
  page?: number;
  limit?: number;
  showHeader?: boolean;
  onBuy?: (coinId: string) => void;
}

export default function CoinListing({ 
  page = 1, 
  limit = 25,
  showHeader = true,
  onBuy 
}: CoinListingProps) {
  const { coins: apiCoins, loading, error, refetch } = useCoins({ page, limit });
  const [localCoins, setLocalCoins] = useState(apiCoins);
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);

  // Update local coins when API coins change
  useEffect(() => {
    setLocalCoins(apiCoins);
  }, [apiCoins]);

  const handleBuy = (coinId: string) => {
    console.log('Buying coin:', coinId);
    onBuy?.(coinId);
  };

  const handleToggleFavorite = async (coinId: string, isFavorite: boolean) => {
    // Optimistically update the UI
    setLocalCoins(prevCoins => 
      prevCoins.map(coin => 
        coin.id === coinId ? { ...coin, is_favorite: isFavorite } : coin
      )
    );

    setFavoriteLoading(!!coinId);
    try {
      if (isFavorite) {
        await favoritesApi.addFavorite(coinId);
        toast({
          title: "Ajouté aux favoris",
          description: "La pièce a été ajoutée à vos favoris",
        });
      } else {
        await favoritesApi.removeFavorite(coinId);
        toast({
          title: "Retiré des favoris",
          description: "La pièce a été retirée de vos favoris",
        });
      }
      // Refetch coins to get updated favorite status from server
      await refetch();
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert optimistic update on error
      setLocalCoins(apiCoins);
      toast({
        title: "Erreur",
        description: "Impossible de modifier les favoris",
        variant: "destructive",
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="mt-10">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Top Or</h2>
          <div className="text-sm text-muted-foreground">
            {loading ? "Chargement..." : `Mise à jour il y a ${Math.floor(Math.random() * 24)} heures`}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4">
          <Error 
            message={error}
            title="Erreur de chargement"
            onRetry={() => window.location.reload()}
          />
        </div>
      )}

      {loading || favoriteLoading ? (
        <Loading 
          message="Chargement des pièces..."
          size="md"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-2">
          {localCoins.map((coin, index) => (
            <CoinCard 
              key={coin.id} 
              coin={{
                ...coin,
                ranking: index + 1
              }}
              onBuy={handleBuy}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

