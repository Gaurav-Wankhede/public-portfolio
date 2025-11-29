"use client";

import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  showCursor?: boolean;
  loop?: boolean;
  delay?: number;
  className?: string;
  cursorClassName?: string;
}

export default function TypewriterText({
  text,
  speed = 30,
  showCursor = false,
  loop = false,
  delay = 0,
  className = "",
  cursorClassName = "",
}: TypewriterTextProps) {
  const letters = Array.from(text);
  const speedInSeconds = speed / 1000;

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: speedInSeconds,
        delayChildren: delay,
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween" as const,
        ease: "easeIn" as const,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  const cursor = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 0, 1, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: 0,
        ease: "linear" as const,
        times: [0, 0.5, 0.5, 1],
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          variants={child}
          className="inline-block"
          style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
      {showCursor && (
        <motion.span
          variants={cursor}
          initial="initial"
          animate="animate"
          className={`inline-block ml-1 w-[2px] h-[1em] bg-current ${cursorClassName}`}
          aria-hidden="true"
        />
      )}
    </motion.span>
  );
}
