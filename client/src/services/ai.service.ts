import api from "./axios";

export interface ChatResponse {
  success: boolean;
  answer: string;
}

export const askChatbot = async (question: string): Promise<string> => {
  const response = await api.post<ChatResponse>("/ai/chat", { question });
  return response.data.answer;
};
