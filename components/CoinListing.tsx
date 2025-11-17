'use client';

import { useState, useEffect } from "react";
import { useCoins } from "@/hooks/useCoins";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import CoinCard from "@/components/CoinCard";
import { favoritesApi } from "@/lib/api/favorites";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const { user, profile } = useAuth();
  const router = useRouter();
  const { coins: apiCoins, loading, error, refetch } = useCoins({ page, limit });
  const [localCoins, setLocalCoins] = useState(apiCoins);
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [pendingCoinId, setPendingCoinId] = useState<string | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Check if user has active subscription
  const isPremium = profile?.subscriptions?.active !== null && profile?.subscriptions?.active !== undefined;

  // Fetch initial favorite count from API only once when user logs in and coins are loaded
  useEffect(() => {
    const fetchInitialFavoriteCount = async () => {
      if (user) {
        try {
          const favorites = await favoritesApi.getFavorites();
          setFavoriteCount(favorites.length);
        } catch (err) {
          console.error('Error fetching initial favorites count:', err);
          // Fallback to local count from API coins
          const count = apiCoins.filter(coin => coin.is_favorite).length;
          setFavoriteCount(count);
        }
      } else if (!user) {
        // Reset count when user logs out
        setFavoriteCount(0);
      }
    };
    fetchInitialFavoriteCount();
  }, []); // Only run when user changes, not when coins change

  // Update local coins when API coins change
  useEffect(() => {
    setLocalCoins(apiCoins);
  }, [apiCoins]);

  const handleBuy = (coinId: string) => {
    console.log('Buying coin:', coinId);
    onBuy?.(coinId);
  };

  const handleToggleFavorite = async (coinId: string, isFavorite: boolean) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // If adding favorite and user is not premium and already has 5 favorites
    if (isFavorite && !isPremium && favoriteCount >= 5) {
      setPendingCoinId(coinId);
      setShowPremiumDialog(true);
      return;
    }

    // Optimistically update the UI
    setLocalCoins(prevCoins => 
      prevCoins.map(coin => 
        coin.id === coinId ? { ...coin, is_favorite: isFavorite } : coin
      )
    );

    try {
      if (isFavorite) {
        await favoritesApi.addFavorite(coinId);
        toast({
          title: "Ajouté aux favoris",
          description: "La pièce a été ajoutée à vos favoris",
        });
        // Update favorite count locally
        setFavoriteCount(prev => prev + 1);
      } else {
        await favoritesApi.removeFavorite(coinId);
        toast({
          title: "Retiré des favoris",
          description: "La pièce a été retirée de vos favoris",
        });
        // Update favorite count locally
        setFavoriteCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert optimistic update on error
      setLocalCoins(prevCoins => 
        prevCoins.map(coin => 
          coin.id === coinId ? { ...coin, is_favorite: !isFavorite } : coin
        )
      );
      toast({
        title: "Erreur",
        description: "Impossible de modifier les favoris",
        variant: "destructive",
      });
    }
  };

  const handleGoToPremium = () => {
    setShowPremiumDialog(false);
    router.push('/membership');
  };

  const handleCloseDialog = () => {
    setShowPremiumDialog(false);
    setPendingCoinId(null);
  };

  // After user pays and comes back, add the pending favorite
  useEffect(() => {
    const addPendingFavorite = async () => {
      if (pendingCoinId && isPremium && user) {
        // User has upgraded, add the favorite
        const coinId = pendingCoinId;
        setPendingCoinId(null);
        
        // Optimistically update the UI
        setLocalCoins(prevCoins => 
          prevCoins.map(coin => 
            coin.id === coinId ? { ...coin, is_favorite: true } : coin
          )
        );

        try {
          await favoritesApi.addFavorite(coinId);
          toast({
            title: "Ajouté aux favoris",
            description: "La pièce a été ajoutée à vos favoris",
          });
          // Update favorite count locally
          setFavoriteCount(prev => prev + 1);
        } catch (err) {
          console.error('Error adding pending favorite:', err);
          // Revert optimistic update on error
          setLocalCoins(prevCoins => 
            prevCoins.map(coin => 
              coin.id === coinId ? { ...coin, is_favorite: false } : coin
            )
          );
          toast({
            title: "Erreur",
            description: "Impossible d'ajouter le favori",
            variant: "destructive",
          });
        }
      }
    };
    addPendingFavorite();
  }, [isPremium, pendingCoinId, user]);

  return (
    <>
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

      {/* Premium Upgrade Dialog */}
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limite de favoris atteinte</DialogTitle>
            <DialogDescription>
              Vous avez atteint la limite de 5 favoris avec le plan gratuit. 
              Passez à Premium pour ajouter un nombre illimité de favoris.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleGoToPremium}>
              Passer à Premium
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

