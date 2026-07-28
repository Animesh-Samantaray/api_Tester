export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  message: string;
  timestamp: Date;
}
