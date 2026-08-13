import client from './client';

/**
 * Review API service
 * Backend route: /api/Review
 */

export async function getAllReviews() {
  const { data } = await client.get('/Review');
  return data;
}

export async function getReviewById(id) {
  const { data } = await client.get(`/Review/${id}`);
  return data;
}

export async function createReview(dto) {
  const { data } = await client.post('/Review', dto);
  return data;
}

export async function updateReview(dto) {
  const { data } = await client.put('/Review', dto);
  return data;
}

export async function deleteReview(id) {
  const { data } = await client.delete(`/Review/${id}`);
  return data;
}
