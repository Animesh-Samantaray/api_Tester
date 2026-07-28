import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../types/chat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message when messages list or loading state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      // Allow transition to finish before scrolling
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading, isOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
      className="fixed z-[9985] flex flex-col overflow-hidden glass-panel rounded-[20px] bottom-24 right-6 w-[calc(100vw-32px)] max-h-[600px] h-[calc(100vh-120px)] md:w-[420px] md:h-[600px]"
    >
      {/* Chat Window Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b select-none"
        style={{
          borderColor: "rgba(255, 255, 255, 0.05)",
          background: "linear-gradient(180deg, rgba(20, 20, 25, 0.8) 0%, rgba(12, 12, 16, 0.4) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-sm text-white tracking-tight">
              <span>🤖 APIHUB AI</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            </div>
            <div 
              className="text-[11px]"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Ask anything about APIHUB
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-all cursor-pointer"
          style={{
            color: "hsl(var(--muted-foreground))",
            backgroundColor: "rgba(255, 255, 255, 0)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0)";
            e.currentTarget.style.color = "hsl(var(--muted-foreground))";
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages viewport area */}
      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto px-5 py-4 scrollbar-thin flex flex-col"
        style={{
          backgroundColor: "rgba(10, 10, 12, 0.2)",
        }}
      >
        {messages.length === 0 ? (
          // Welcome message layout
          <div className="my-auto flex flex-col">
            <div
              className="p-5 rounded-2xl border"
              style={{
                backgroundColor: "rgba(20, 20, 25, 0.65)",
                borderColor: "rgba(255, 255, 255, 0.05)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span>👋</span> Hello!
              </h3>
              <p 
                className="text-xs mb-4 leading-relaxed font-medium"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                I'm APIHUB AI. I can help you with:
              </p>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {[
                  "API Requests",
                  "Collections",
                  "Authentication",
                  "History",
                  "HTTP Methods",
                  "Headers",
                  "Query Parameters",
                  "Settings",
                  "Dashboard",
                  "Profile",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => onSendMessage(`Tell me about ${item}`)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-left text-xs transition-all border font-medium select-none cursor-pointer"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      borderColor: "rgba(255, 255, 255, 0.05)",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.2)";
                      e.currentTarget.style.color = "#a5b4fc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                    }}
                  >
                    <span style={{ color: "#8B5CF6" }}>•</span>
                    {item}
                  </button>
                ))}
              </div>

              <p 
                className="text-xs font-semibold"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                How can I help you today?
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}

        {isLoading && <TypingIndicator />}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        isOpen={isOpen}
      />
    </motion.div>
  );
};
