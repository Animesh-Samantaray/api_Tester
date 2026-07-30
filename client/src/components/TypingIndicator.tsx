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
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-border/40 bg-secondary/30 backdrop-blur-md w-fit text-xs font-semibold text-muted-foreground select-none shadow-sm shadow-black/5">
      <motion.div
        className="flex items-center gap-1 h-3"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
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
      <span>APIHUB AI is typing...</span>
    </div>
  );
};
