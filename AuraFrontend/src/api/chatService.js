import client from './client';

/**
 * AI Shopping Assistant Chatbot API Service
 */

export async function sendChatMessage({ message, history, conversationId }) {
  const { data } = await client.post('/chat/message', {
    message,
    history,
    conversationId,
  });
  return data;
}
