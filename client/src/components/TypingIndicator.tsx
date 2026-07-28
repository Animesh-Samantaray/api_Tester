import React from "react";
import { motion } from "framer-motion";

export const TypingIndicator: React.FC = () => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [0, -6, 0] },
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div 
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border w-fit text-sm select-none"
      style={{
        backgroundColor: "rgba(24, 24, 27, 0.6)",
        borderColor: "rgba(255, 255, 255, 0.05)",
        color: "hsl(var(--muted-foreground))",
      }}
    >
      <motion.div
        className="flex items-center gap-1 h-3"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#8B5CF6" }}
            variants={dotVariants}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>
      <span className="font-medium">APIHUB AI is thinking...</span>
    </div>
  );
};
