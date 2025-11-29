'use client';

import { useEffect, useRef } from 'react';
import { animateCards } from '@/lib/animations/gsap-animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export default function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  hover = true 
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Add animation classes
    card.classList.add('animate-card');
    
    // Trigger animation with delay
    const timer = setTimeout(() => {
      animateCards([card]);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className={`animated-card ${hover ? 'hover:scale-105' : ''} transition-transform duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
