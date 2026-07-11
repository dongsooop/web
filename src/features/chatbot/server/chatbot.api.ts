import 'server-only';

import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

import type { ChatbotRequest } from '../types';

function getRequiredChatbotConfig() {
  const baseUrl = process.env.AI_URL;
  const endpoint = process.env.CHATBOT_ENDPOINT;

  if (!baseUrl) {
    throw new Error('AI_URL_MISSING');
  }

  if (!endpoint) {
    throw new Error('CHATBOT_ENDPOINT_MISSING');
  }

  return {
    baseUrl,
    endpoint,
  };
}

export function requestChatbotWithServer(
  payload: ChatbotRequest,
  options: {
    accessToken?: string;
    refreshToken?: string;
    appCheckToken?: string;
  },
) {
  const { baseUrl, endpoint } = getRequiredChatbotConfig();

  return serverFetchAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
    baseUrl,
  });
}
