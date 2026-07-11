import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { ChatbotRequest, ChatbotResponse } from '../types';

export function requestChatbot(payload: ChatbotRequest) {
  return clientRequestAuth<ChatbotResponse>('/bff/chatbot', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
