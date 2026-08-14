import client from './client';
import { getImageUrl } from '../utils/imageUrl';

/**
 * Maps a product object from the backend DTO shape to the shape
 * the frontend components expect.
 */
function mapProduct(dto) {
  const images = (dto.imageUrls && dto.imageUrls.length > 0)
    ? dto.imageUrls.map(getImageUrl)
    : [];

  return {
    ...dto,
    images: images,
    category: dto.categoryName ?? '',
    rating: dto.averageRating ?? null,
    reviews: dto.reviewCount ?? null,
    alt: dto.name,
  };
}

/**
 * Fetch all products.
 * Backend route: GET /api/Product  → ProductGetDto[]
 */
export async function getAllProducts() {
  const { data } = await client.get('/Product');
  return data.map(mapProduct);
}

/**
 * Fetch a single product by its GUID id.
 * Backend route: GET /api/Product/{id:guid}  → ProductDetailsDto
 */
export async function getProductById(id) {
  const { data } = await client.get(`/Product/${id}`);
  return mapProduct(data);
}
