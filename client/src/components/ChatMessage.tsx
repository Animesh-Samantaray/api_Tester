import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { ChatMessage as ChatMessageType } from "../types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

const CodeBlock: React.FC<{ code: string; language: string }> = ({
  code,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="my-2.5 rounded-lg overflow-hidden border font-mono text-xs w-full max-w-full"
      style={{
        borderColor: "rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(10, 10, 12, 0.95)",
      }}
    >
      <div 
        className="flex justify-between items-center px-3 py-1.5 text-[10px] select-none border-b"
        style={{
          backgroundColor: "rgba(20, 20, 25, 0.9)",
          borderColor: "rgba(255, 255, 255, 0.05)",
          color: "hsl(var(--muted-foreground))",
        }}
      >
        <span className="font-semibold">{language.toUpperCase() || "CODE"}</span>
        <button
          onClick={handleCopy}
          className="transition-colors hover:text-white cursor-pointer font-medium"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-zinc-200 scrollbar-thin">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useAuth();
  const isUser = message.sender === "user";

  const formatTime = (date: Date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const parseInline = (text: string): React.ReactNode[] => {
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded font-mono text-xs border"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderColor: "rgba(255, 255, 255, 0.05)",
              color: "#f472b6",
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderMarkdown = (text: string) => {
    // Split by block code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : "";
        const code = match ? match[2] : part.slice(3, -3);

        return <CodeBlock key={idx} code={code} language={language} />;
      }

      const lines = part.split("\n");
      return (
        <div key={idx}>
          {lines.map((line, lineIdx) => {
            // Check for list bullet point (•, *, or -)
            const isBullet = /^\s*[•*\-]\s+(.*)/.exec(line);
            if (isBullet) {
              return (
                <li
                  key={lineIdx}
                  className="ml-4 list-disc pl-1 mb-1 text-sm leading-relaxed"
                  style={{ color: "rgba(255, 255, 255, 0.95)" }}
                >
                  {parseInline(isBullet[1])}
                </li>
              );
            }

            if (line.trim() === "") {
              return <div key={lineIdx} className="h-2" />;
            }

            return (
              <p
                key={lineIdx}
                className="text-sm leading-relaxed mb-1.5"
                style={{ color: "rgba(255, 255, 255, 0.95)" }}
              >
                {parseInline(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-start gap-2.5 mb-4 w-full ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar Icon */}
      {isUser ? (
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border select-none overflow-hidden"
          style={{
            backgroundColor: "rgba(99, 102, 241, 0.15)",
            borderColor: "rgba(99, 102, 241, 0.25)",
            color: "#a5b4fc",
          }}
        >
          {user?.avatar ? (
            <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
          ) : (
            <User size={14} />
          )}
        </div>
      ) : (
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border select-none text-white"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
          }}
        >
          <Bot size={14} />
        </div>
      )}

      {/* Message Bubble & Time */}
      <div className={`flex flex-col max-w-[76%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className="px-4 py-3 shadow-md border"
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg, #5850EC 0%, #7E3AF2 100%)",
                  borderColor: "rgba(255, 255, 255, 0.05)",
                  color: "#ffffff",
                  borderRadius: "18px 2px 18px 18px",
                }
              : {
                  backgroundColor: "rgba(22, 22, 26, 0.85)",
                  borderColor: "rgba(255, 255, 255, 0.06)",
                  color: "#ffffff",
                  borderRadius: "2px 18px 18px 18px",
                }
          }
        >
          <div className="text-sm break-words">{renderMarkdown(message.message)}</div>
        </div>
        
        {/* Timestamp */}
        <span
          className="text-[9px] mt-1 px-1 select-none font-medium"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
};
