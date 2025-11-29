"use client";

import { motion } from "framer-motion";

interface InlineCardLoaderProps {
  text?: string;
  className?: string;
}

export default function InlineCardLoader({
  text = "Loading",
  className = ""
}: InlineCardLoaderProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Mini spinner with gradient ring */}
      <span className="relative w-4 h-4">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </span>

      {/* Text with animated dots */}
      <span className="flex items-center">
        {text}
        <span className="flex gap-0.5 ml-0.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1 h-1 rounded-full bg-current"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </span>
      </span>
    </span>
  );
}
