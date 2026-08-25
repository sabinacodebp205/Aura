/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAllFavorites, addFavorite, removeFavorite } from '../api/favoriteService';
import { products as staticSeedProducts } from '../data/products';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);


export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();

  // Store full favorite items from backend
  const [favorites, setFavorites] = useState([]);
  // Store list of favorited product IDs
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch favorites from backend if logged in
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteIds([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getAllFavorites();
      if (Array.isArray(data)) {
        setFavorites(data);
        setFavoriteIds(data.map((fav) => fav.productId));
      }
    } catch (err) {
      console.warn('FavoritesContext: Failed to fetch favorites from backend', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const value = useMemo(() => {
    const toggleFavorite = async (productId, extraProductInfo = null) => {
      if (!isAuthenticated) {
        alert('Favorilərə əlavə etmək üçün daxil olun');
        return;
      }

      const isCurrentlyFav = favoriteIds.includes(productId);

      // Optimistic update
      if (isCurrentlyFav) {
        setFavoriteIds((prev) => prev.filter((id) => id !== productId));
        setFavorites((prev) => prev.filter((fav) => fav.productId !== productId && fav.id !== productId));
      } else {
        setFavoriteIds((prev) => [...prev, productId]);
        if (extraProductInfo) {
          setFavorites((prev) => [...prev, extraProductInfo]);
        }
      }

      // Backend sync if logged in
      if (isAuthenticated) {
        try {
          if (isCurrentlyFav) {
            // Find existing favorite record to get its backend ID
            const existingFav = favorites.find((fav) => fav.productId === productId || fav.id === productId);
            const favIdToDelete = existingFav?.id || productId;
            await removeFavorite(favIdToDelete);
          } else {
            await addFavorite(productId);
          }
          // Re-fetch to synchronize state and get assigned Favorite GUIDs
          await fetchFavorites();
        } catch (err) {
          console.warn('FavoritesContext: API toggle failed, reverting local state', err);
          // Revert optimistic update on failure
          if (isCurrentlyFav) {
            setFavoriteIds((prev) => [...prev, productId]);
          } else {
            setFavoriteIds((prev) => prev.filter((id) => id !== productId));
          }
          fetchFavorites();
        }
      }
    };

    return {
      favorites,
      favoriteIds,
      toggleFavorite,
      loading,
      refetchFavorites: fetchFavorites,
    };
  }, [favorites, favoriteIds, loading, fetchFavorites, isAuthenticated]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }
  return context;
}
