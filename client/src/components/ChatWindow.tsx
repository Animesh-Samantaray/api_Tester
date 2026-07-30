import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Sparkles, RotateCcw, Minus, Folder, Key, Globe, History, BarChart2, Terminal } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../types/chat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading, isOpen]);

  const welcomeGridOptions = [
    {
      title: "Test Requests",
      desc: "Send mock or real HTTP calls",
      icon: <Terminal size={16} className="text-indigo-400" />,
      query: "Tell me how to send API requests",
    },
    {
      title: "Collections",
      desc: "Group endpoints in folders",
      icon: <Folder size={16} className="text-purple-400" />,
      query: "Tell me how request Collections work",
    },
    {
      title: "Auth Headers",
      desc: "Bearer Tokens & Basic headers",
      icon: <Key size={16} className="text-pink-400" />,
      query: "Explain authentication support",
    },
    {
      title: "Environments",
      desc: "Configure variables mappings",
      icon: <Globe size={16} className="text-sky-400" />,
      query: "Explain environment variables syntax",
    },
    {
      title: "Request History",
      desc: "Track and restore prior calls",
      icon: <History size={16} className="text-emerald-400" />,
      query: "How does Request History work?",
    },
    {
      title: "Dashboard Specs",
      desc: "Workspace analytics profiles",
      icon: <BarChart2 size={16} className="text-amber-400" />,
      query: "Tell me about the Dashboard settings",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed z-[9985] flex flex-col overflow-hidden glass-panel rounded-[24px] bottom-24 right-6 w-[calc(100vw-32px)] max-h-[620px] h-[calc(100vh-120px)] md:w-[440px] md:h-[620px] border border-white/10 dark:border-white/5 shadow-2xl shadow-black/30"
    >
      {/* Chat Window Sticky Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 dark:border-white/5 select-none bg-card/90 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3">
          {/* Animated AI Avatar Sphere */}
          <div className="relative flex h-10 w-10 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/20 opacity-75"></span>
            <div className="relative inline-flex rounded-full h-10 w-10 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 items-center justify-center border border-white/15 shadow-md text-white">
              <Sparkles size={18} className="animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground tracking-tight leading-none">
                APIHUB AI
              </span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground mt-1">
              Powered by AI Assistant
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1 select-none">
          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="p-1.5 rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              title="Clear conversation"
            >
              <RotateCcw size={15} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-secondary/40"
            title="Minimize"
          >
            <Minus size={15} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-secondary/40"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Messages viewport area */}
      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto px-5 py-4 scrollbar-thin flex flex-col bg-background/5"
      >
        {messages.length === 0 ? (
          // Welcome message layout matching Claude/ChatGPT
          <div className="flex flex-col gap-5 mt-2 justify-center items-center my-auto">
            {/* Glowing orb AI greeting */}
            <div className="flex flex-col items-center text-center px-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/20 mb-4 animate-pulse">
                <Sparkles size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1 tracking-tight">
                How can I help you build today?
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                I'm APIHUB AI. Ask me about testing endpoints, organizing Collections, managing variables, or customizing authentication headers.
              </p>
            </div>

            {/* Modern suggested action grid cards with gradient borders */}
            <div className="w-full flex flex-col gap-2 mt-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-1 select-none">
                Suggested Actions
              </span>
              <div className="grid grid-cols-2 gap-3 w-full">
                {welcomeGridOptions.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => onSendMessage(item.query)}
                    className="p-[1px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/30 hover:via-purple-500/30 hover:to-pink-500/30 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer text-left h-full active:scale-[0.98]"
                  >
                    <div className="bg-card dark:bg-[#15151a] rounded-[15px] p-3 w-full h-full flex flex-col gap-1.5 border border-white/5 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shadow-inner shrink-0">
                          {item.icon}
                        </div>
                        <span className="font-bold text-[11px] text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-snug">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Session date anchor */}
            <div className="flex items-center justify-center my-4 select-none shrink-0">
              <div className="h-[1px] bg-border/20 w-1/4"></div>
              <span className="text-[10px] mx-3 text-muted-foreground font-semibold uppercase tracking-wider">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <div className="h-[1px] bg-border/20 w-1/4"></div>
            </div>
            
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        )}

        {isLoading && <TypingIndicator />}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-ups above input when active */}
      {messages.length > 0 && !isLoading && (
        <div className="flex gap-2 overflow-x-auto px-4 py-2 border-t border-border/20 bg-card/60 backdrop-blur-md scrollbar-none select-none shrink-0">
          {[
            "How do I set Auth headers?",
            "Tell me about GET vs POST",
            "Clear conversation",
          ].map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === "Clear conversation") {
                  onClearChat();
                } else {
                  onSendMessage(item);
                }
              }}
              className="flex-none px-3.5 py-1.5 rounded-full border border-border/60 bg-card hover:bg-secondary hover:text-primary transition-all text-xs font-semibold text-muted-foreground select-none cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Sticky Input panel with soft transparent fade */}
      <div className="sticky bottom-0 z-50 shrink-0 bg-gradient-to-t from-card via-card/80 to-transparent">
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          isOpen={isOpen}
        />
      </div>
    </motion.div>
  );
};

