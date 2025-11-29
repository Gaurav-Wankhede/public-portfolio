'use client';

import { useEffect, useRef } from 'react';
import { initializePageAnimations, cleanupScrollTriggers } from '@/lib/animations/gsap-animations';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  enableAnimations?: boolean;
}

export default function AnimatedContainer({ 
  children, 
  className = '', 
  enableAnimations = true 
}: AnimatedContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableAnimations) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Initialize animations after component mounts
    const timer = setTimeout(() => {
      initializePageAnimations(container);
    }, 50);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      cleanupScrollTriggers();
    };
  }, [enableAnimations]);

  return (
    <div 
      ref={containerRef}
      className={`animated-container ${className}`}
    >
      {children}
    </div>
  );
}
