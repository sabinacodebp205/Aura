import client from './client';

/**
 * AI Studio API service wrapper for assistant chatbot, step generator,
 * pattern uploads, saved designs, and custom product creation.
 */

export async function sendChatMessage({ conversationId, userMessage, currentSpec }) {
  const { data } = await client.post('/ai-studio/chat', {
    conversationId,
    userMessage,
    currentSpec,
  });
  return data;
}

export async function generateDesign(spec) {
  const { data } = await client.post('/ai-studio/generate', { spec });
  return data;
}

export async function uploadPattern(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await client.post('/ai-studio/upload-pattern', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getSavedDesigns() {
  const { data } = await client.get('/ai-studio/designs');
  return data;
}

export async function getSavedDesignById(id) {
  const { data } = await client.get(`/ai-studio/designs/${id}`);
  return data;
}

export async function saveDesign(spec, name) {
  const { data } = await client.post('/ai-studio/designs', { spec, name });
  return data;
}

export async function duplicateDesign(id) {
  const { data } = await client.post(`/ai-studio/designs/${id}/duplicate`);
  return data;
}

export async function deleteSavedDesign(id) {
  const { data } = await client.delete(`/ai-studio/designs/${id}`);
  return data;
}

export async function createCustomProduct({
  sourceDesignId,
  garmentType,
  color,
  size,
  generatedImageUrl,
  basePrice,
  customizationFee,
}) {
  const { data } = await client.post('/ai-studio/products/custom', {
    sourceDesignId: sourceDesignId || '00000000-0000-0000-0000-000000000000',
    garmentType,
    color,
    size: size || 'M',
    generatedImageUrl,
    basePrice: basePrice || 124,
    customizationFee: customizationFee || 15,
  });
  return data;
}
