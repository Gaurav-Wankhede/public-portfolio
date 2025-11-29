'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  texts: string[];
  displayDuration?: number;
  transitionDuration?: number;
  animationType?: 'fade' | 'fade-slide' | 'fade-scale';
  className?: string;
}

export default function RotatingText({
  texts,
  displayDuration = 3000,
  transitionDuration = 600,
  animationType = 'fade-slide',
  className = '',
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || texts.length <= 1) return;

    const timeout = setTimeout(() => {
      setIndex((current) => (current + 1) % texts.length);
    }, displayDuration);

    return () => clearTimeout(timeout);
  }, [index, texts.length, displayDuration, isPaused]);

  const getVariants = () => {
    const duration = transitionDuration / 1000;

    switch (animationType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'fade-slide':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
        };
      case 'fade-scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
        };
    }
  };

  const variants = getVariants();
  const duration = transitionDuration / 1000;

  return (
    <span
      className={`inline-block ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={texts[index]}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration,
            ease: 'easeInOut',
          }}
          className="inline-block"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
