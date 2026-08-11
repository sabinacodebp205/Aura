import client from './client';

/**
 * Maps a product object from the backend DTO shape to the shape
 * the frontend components expect.
 *
 * Backend (ProductGetDto / ProductDetailsDto) → Frontend product:
 *   imageUrls   → images
 *   categoryName → category
 *   averageRating → rating   (only present on detail DTO)
 *   reviewCount  → reviews   (only present on detail DTO)
 *   (no alt)     → alt       (synthesized from name)
 */
function mapProduct(dto) {
  return {
    ...dto,
    images: dto.imageUrls ?? [],
    category: dto.categoryName ?? '',
    rating: dto.averageRating ?? null,
    reviews: dto.reviewCount ?? null,
    alt: dto.name,
  };
}

/**
 * Fetch all products.
 * Backend route: GET /api/Product  → ProductGetDto[]
 *
 * Note: the list DTO does NOT include averageRating or reviewCount,
 * so `rating` and `reviews` will be null on list items.
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
