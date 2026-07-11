export type ChatMessage = {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  url?: string;
};

export type ChatbotRequest = {
  text: string;
};

export type ChatbotResponse = {
  engine: string;
  text: string;
  url?: string;
};
