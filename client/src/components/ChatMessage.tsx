import React, { useState } from "react";
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
    <div
      className={`flex flex-col mb-4 w-full ${
        isUser ? "items-end" : "items-start"
      }`}
    >
      <div
        className="max-w-[85%] px-4 py-3 shadow-md"
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                color: "#ffffff",
                borderRadius: "18px 18px 2px 18px",
              }
            : {
                backgroundColor: "rgba(24, 24, 27, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                color: "#ffffff",
                borderRadius: "18px 18px 18px 2px",
              }
        }
      >
        <div className="text-sm break-words">{renderMarkdown(message.message)}</div>
      </div>
      <span
        className="text-[10px] mt-1 px-1 select-none"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
};
