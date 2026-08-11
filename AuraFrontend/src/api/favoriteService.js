import client from './client';

/**
 * Favorite endpoints — all require [Authorize].
 *
 * Backend routes (FavoriteController):
 *   GET    /api/Favorite          → FavoriteGetDto[]
 *   GET    /api/Favorite/{id}     → FavoriteGetDto
 *   POST   /api/Favorite          → body: FavoriteCreateDto { productId }
 *   DELETE /api/Favorite/{id}     → deletes favorite by Favorite ID (Guid)
 *
 * FavoriteGetDto shape:
 *   { id, productId, productName, price, imageUrl }
 */

export async function getAllFavorites() {
  const { data } = await client.get('/Favorite');
  return data;
}

export async function getFavoriteById(id) {
  const { data } = await client.get(`/Favorite/${id}`);
  return data;
}

export async function addFavorite(productId) {
  const { data } = await client.post('/Favorite', { productId });
  return data;
}

export async function removeFavorite(favoriteId) {
  const { data } = await client.delete(`/Favorite/${favoriteId}`);
  return data;
}
