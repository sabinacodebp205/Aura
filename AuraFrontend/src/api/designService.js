import client from './client';

/**
 * Design endpoints — all require [Authorize].
 *
 * Backend routes (DesignController):
 *   GET    /api/Design          → DesignGetDto[]
 *   GET    /api/Design/{id}     → DesignGetDto
 *   POST   /api/Design          → body: DesignCreateDto { prompt, productId }
 *   PUT    /api/Design          → body: DesignUpdateDto { id, prompt }
 *   DELETE /api/Design/{id}
 *
 * DesignGetDto shape:
 *   { id, prompt, imageUrl, extraPrice, productId }
 */

export async function getAllDesigns() {
  const { data } = await client.get('/Design');
  return data;
}

export async function getDesignById(id) {
  const { data } = await client.get(`/Design/${id}`);
  return data;
}

export async function createDesign({ prompt, productId }) {
  const { data } = await client.post('/Design', { prompt, productId });
  return data;
}

export async function updateDesign({ id, prompt }) {
  const { data } = await client.put('/Design', { id, prompt });
  return data;
}

export async function deleteDesign(id) {
  const { data } = await client.delete(`/Design/${id}`);
  return data;
}
