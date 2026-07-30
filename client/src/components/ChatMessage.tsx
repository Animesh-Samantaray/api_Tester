import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Bot, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { ChatMessage as ChatMessageType } from "../types/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

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
    <div className="my-4 rounded-xl overflow-hidden border border-border bg-[#0a0a0c] shadow-lg shadow-black/20 font-mono text-xs w-full max-w-full">
      <div className="flex justify-between items-center px-4 py-2.5 text-[11px] select-none border-b border-border/40 bg-zinc-900/60 text-muted-foreground font-semibold">
        <span className="tracking-wider text-primary font-bold">{language.toUpperCase() || "CODE"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 transition-colors hover:text-primary active:scale-95 cursor-pointer px-2 py-1 rounded bg-secondary/30 border border-border/20 text-muted-foreground hover:bg-secondary font-medium"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-zinc-100 scrollbar-thin leading-relaxed">
        <code className={`language-${language}`}>{code.trim()}</code>
      </pre>
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isUser = message.sender === "user";
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState<"up" | "down" | null>(null);

  const formatTime = (date: Date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.message);
    setCopied(true);
    showToast("Copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMarkdown = (text: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const codeString = String(children).replace(/\n$/, "");
            return language ? (
              <CodeBlock code={codeString} language={language} />
            ) : (
              <code
                className={`px-1.5 py-0.5 rounded font-mono text-xs ${
                  isUser
                    ? "bg-black/30 border border-white/10 text-pink-300"
                    : "bg-secondary/40 border border-border/40 text-pink-500 dark:text-pink-400"
                } ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mt-3.5 mb-2 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mt-3 mb-1.5 text-foreground">{children}</h3>,
          p: ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2.5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2.5 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-2 bg-secondary/20 rounded-r-lg italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-border/60" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 border border-border/40 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-secondary/40 text-muted-foreground font-semibold border-b border-border/40">{children}</thead>,
          th: ({ children }) => <th className="px-4 py-2 border-r border-border/20 last:border-0">{children}</th>,
          tbody: ({ children }) => <tbody className="divide-y divide-border/20">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-secondary/10 transition-colors">{children}</tr>,
          td: ({ children }) => <td className="px-4 py-2 border-r border-border/20 last:border-0">{children}</td>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-start gap-3 mb-5 w-full ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar Icon */}
      {isUser ? (
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-primary/20 bg-primary/10 text-primary select-none overflow-hidden shadow-sm">
          {user?.avatar ? (
            <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
          ) : (
            <User size={14} />
          )}
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/10 select-none text-white bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/20">
          <Bot size={14} />
        </div>
      )}

      {/* Message Bubble & Time */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"} relative group`}>
        <div
          className={`px-4 py-3 shadow-md border text-sm break-words relative leading-relaxed ${
            isUser
              ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-white/5 text-white rounded-2xl rounded-tr-none shadow-indigo-500/10"
              : "bg-white/10 dark:bg-white/5 backdrop-blur-md border-white/10 dark:border-white/5 text-foreground rounded-2xl rounded-tl-none shadow-sm"
          }`}
        >
          {renderMarkdown(message.message)}
        </div>

        {/* Hover Copy Button */}
        <button
          onClick={handleCopyMessage}
          className={`absolute top-2.5 ${
            isUser ? "-left-10" : "-right-10"
          } p-1.5 rounded-lg bg-card border border-border/80 shadow-md text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10`}
          title="Copy Message"
        >
          {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
        </button>
        
        {/* Timestamp */}
        <span className="text-[10px] mt-1 px-1.5 select-none font-medium text-muted-foreground">
          {formatTime(message.timestamp)}
        </span>

        {/* AI Action feedback toolbar */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-1 ml-1 select-none">
            <button
              onClick={() => setRated(rated === "up" ? null : "up")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                rated === "up" ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
              title="Helpful"
            >
              <ThumbsUp size={12} />
            </button>
            <button
              onClick={() => setRated(rated === "down" ? null : "down")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                rated === "down" ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
              title="Not Helpful"
            >
              <ThumbsDown size={12} />
            </button>
            <button
              onClick={handleCopyMessage}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
              title="Copy"
            >
              <Copy size={12} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
