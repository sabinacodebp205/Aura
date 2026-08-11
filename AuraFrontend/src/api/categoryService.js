import client from './client';

/**
 * Fetch all categories.
 * Backend route: GET /api/Category -> CategoryGetDto[] ({ id: Guid, name: string })
 */
export async function getAllCategories() {
  const { data } = await client.get('/Category');
  return data;
}
