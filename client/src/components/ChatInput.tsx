import React, { useRef, useEffect, useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isOpen: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isOpen,
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Automatically focus input when open state changes
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      // Small timeout to ensure components are animated and visible
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Dynamically adjust the height of the textarea based on text length
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t"
      style={{
        borderColor: "rgba(255, 255, 255, 0.05)",
        backgroundColor: "rgba(10, 10, 12, 0.4)",
      }}
    >
      <div className="relative flex items-end w-full">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask APIHUB AI..."
          rows={1}
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3 rounded-xl text-sm transition-all resize-none scrollbar-thin"
          style={{
            minHeight: "44px",
            maxHeight: "120px",
            lineHeight: "20px",
            backgroundColor: "rgba(20, 20, 25, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            outline: "none",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "hsl(var(--ring))";
            e.target.style.boxShadow = "0 0 0 2px hsl(var(--ring) / 0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
            e.target.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.4)";
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 bottom-2 p-2 rounded-lg flex items-center justify-center transition-all"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            color: "#ffffff",
            cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            opacity: isLoading || !input.trim() ? 0.4 : 1,
            boxShadow: "0 2px 6px rgba(99, 102, 241, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(99, 102, 241, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(99, 102, 241, 0.3)";
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
};
