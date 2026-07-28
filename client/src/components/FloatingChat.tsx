import React, { useState, useEffect, useRef } from "react";
import { FloatingChatButton } from "./FloatingChatButton";
import { ChatWindow } from "./ChatWindow";
import type { ChatMessage } from "../types/chat";
import { askChatbot } from "../services/ai.service";
import { AnimatePresence } from "framer-motion";

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  // Keyboard listener: Escape key closes chatbot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener: Click outside chatbot closes it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        closeChat();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Create unique ID for the user's message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      sender: "user",
      message: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const responseText = await askChatbot(text);
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
        sender: "ai",
        message: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI response generation failed:", error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
        sender: "ai",
        message: "Sorry, something went wrong.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={chatRef}>
      <FloatingChatButton onClick={toggleChat} isOpen={isOpen} />
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            isOpen={isOpen}
            onClose={closeChat}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
