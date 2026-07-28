import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

interface FloatingChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  onClick,
  isOpen,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end">
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-16 right-0 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shadow-lg border pointer-events-none"
            style={{
              backgroundColor: "rgba(15, 15, 20, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#ffffff",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
            }}
          >
            Ask APIHUB AI
            {/* Small tooltip arrow */}
            <div
              className="absolute right-6 -bottom-1 w-2 h-2 rotate-45 border-r border-b"
              style={{
                backgroundColor: "rgba(15, 15, 20, 0.95)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button wrapper for pulse rings */}
      <div className="relative">
        {/* Pulse rings when idle and not open */}
        {!isOpen && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                zIndex: -1,
              }}
              animate={{
                scale: [1, 1.4],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                zIndex: -2,
              }}
              animate={{
                scale: [1, 1.2],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 2,
                delay: 0.6,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </>
        )}

        {/* Main Floating Chat Button */}
        <motion.button
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-xl select-none"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            color: "#ffffff",
            border: "none",
            outline: "none",
            boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={isOpen ? { rotate: 90 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Bot size={28} className="text-white" />
        </motion.button>
      </div>
    </div>
  );
};
