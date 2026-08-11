import client from './client';

/**
 * OrderItem endpoints — all require [Authorize].
 *
 * Backend routes (OrderItemController):
 *   GET    /api/OrderItem          → OrderItemGetDto[]
 *   GET    /api/OrderItem/{id}     → OrderItemGetDto
 *   POST   /api/OrderItem          → body: OrderItemCreateDto { productId, quantity, designId? }
 *   PUT    /api/OrderItem/{id}     → body: OrderItemCreateDto { productId, quantity, designId? }
 *   DELETE /api/OrderItem/{id}
 *
 * OrderItemGetDto shape:
 *   { productId, productName, price, quantity, imageUrl, designId }
 *   NOTE: the DTO does NOT include an OrderItem `id` field.
 */

/** Fetch all order items (across all orders for the user). */
export async function getAllOrderItems() {
  const { data } = await client.get('/OrderItem');
  return data;
}

/** Fetch a single order item by its GUID. */
export async function getOrderItemById(id) {
  const { data } = await client.get(`/OrderItem/${id}`);
  return data;
}

/**
 * Create a new order item.
 * @param {{ productId: string, quantity: number, designId?: string }} dto
 */
export async function createOrderItem(dto) {
  const { data } = await client.post('/OrderItem', dto);
  return data;
}

/**
 * Update an existing order item (replaces productId, quantity, designId).
 * @param {string} id - OrderItem GUID
 * @param {{ productId: string, quantity: number, designId?: string }} dto
 */
export async function updateOrderItem(id, dto) {
  const { data } = await client.put(`/OrderItem/${id}`, dto);
  return data;
}

/** Delete an order item by its GUID. */
export async function deleteOrderItem(id) {
  const { data } = await client.delete(`/OrderItem/${id}`);
  return data;
}
