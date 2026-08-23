import client from './client';
import { getImageUrl } from '../utils/imageUrl';

/**
 * Maps a product object from the backend DTO shape to the shape
 * the frontend components expect.
 */
function mapProduct(dto) {
  const images = (dto.imageUrls && dto.imageUrls.length > 0)
    ? dto.imageUrls.map(getImageUrl).filter(Boolean)
    : [];

  const hash = dto.id ? String(dto.id).charCodeAt(dto.id.length - 1) : 0;
  let discountPercent = 0;
  if (hash % 2 === 0) discountPercent = 15; // roughly 50% of products
  else if (hash % 3 === 0) discountPercent = 20; // roughly 16% of products

  const originalPrice = dto.price || 0;
  const hasDiscount = discountPercent > 0;
  const price = hasDiscount ? originalPrice * (1 - discountPercent / 100) : originalPrice;

  return {
    ...dto,
    images: images,
    category: dto.categoryName ?? '',
    rating: dto.averageRating ?? null,
    reviews: dto.reviewCount ?? null,
    alt: dto.name,
    originalPrice,
    price,
    discountPercent,
    hasDiscount
  };
}

/**
 * Fetch all products.
 * Backend route: GET /api/Product  → ProductGetDto[]
 */
export async function getAllProducts() {
  const { data } = await client.get('/Product');
  const mapped = data.map(mapProduct);
  // Shuffle array so products don't always show up in the same order
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
  }
  return mapped;
}

/**
 * Fetch a single product by its GUID id.
 * Backend route: GET /api/Product/{id:guid}  → ProductDetailsDto
 */
export async function getProductById(id) {
  const { data } = await client.get(`/Product/${id}`);
  return mapProduct(data);
}
