import { useFavorites } from '../context/FavoritesContext';

export function useFavorite(productId) {
  const { favoriteIds, toggleFavorite } = useFavorites();

  return {
    isFavorite: favoriteIds.includes(productId),
    toggleFavorite: () => toggleFavorite(productId),
  };
}
