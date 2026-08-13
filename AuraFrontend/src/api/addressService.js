import client from './client';

/**
 * Address API service
 * Backend route: /api/Address
 */

export async function getAllAddresses() {
  const { data } = await client.get('/Address');
  return data;
}

export async function getAddressById(id) {
  const { data } = await client.get(`/Address/${id}`);
  return data;
}

export async function createAddress(dto) {
  const { data } = await client.post('/Address', dto);
  return data;
}

export async function updateAddress(dto) {
  const { data } = await client.put('/Address', dto);
  return data;
}

export async function deleteAddress(id) {
  const { data } = await client.delete(`/Address/${id}`);
  return data;
}
