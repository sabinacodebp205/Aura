import client from './client';

/**
 * Order endpoints — all require [Authorize].
 *
 * Backend routes (OrderController):
 *   GET    /api/Order          → OrderGetDto[]
 *   GET    /api/Order/{id}     → OrderGetDto
 *   POST   /api/Order          → body: OrderCreateDto { addressId, orderItems[] }
 *   PUT    /api/Order          → body: OrderUpdateDto { id, addressId }
 *   PATCH  /api/Order/status   → body: OrderStatusUpdateDto { id, status }
 *   DELETE /api/Order/{id}
 *
 * OrderGetDto shape:
 *   { id, totalPrice, status, paymentStatus,
 *     orderItems: [{ productId, productName, price, quantity, imageUrl, designId }] }
 *
 * OrderCreateDto shape:
 *   { addressId: guid, orderItems: [{ productId, quantity, designId? }] }
 */

/** Fetch all orders for the authenticated user. */
export async function getAllOrders() {
  const { data } = await client.get('/Order');
  return data;
}

/** Fetch a single order by its GUID. */
export async function getOrderById(id) {
  const { data } = await client.get(`/Order/${id}`);
  return data;
}

/**
 * Create a new order.
 * @param {{ addressId: string, orderItems: Array<{ productId: string, quantity: number, designId?: string }> }} dto
 */
export async function createOrder(dto) {
  const { data } = await client.post('/Order', dto);
  return data;
}

/**
 * Update an existing order (only addressId can change).
 * @param {{ id: string, addressId: string }} dto
 */
export async function updateOrder(dto) {
  const { data } = await client.put('/Order', dto);
  return data;
}

/**
 * Update the status of an existing order.
 * @param {string} id
 * @param {number|string} status
 */
export async function updateOrderStatus(id, status) {
  const { data } = await client.patch('/Order/status', { id, status });
  return data;
}

/** Delete an order by its GUID. */
export async function deleteOrder(id) {
  const { data } = await client.delete(`/Order/${id}`);
  return data;
}
