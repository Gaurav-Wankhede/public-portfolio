'use client';

import { useEffect, useRef } from 'react';
import { createHorizontalScroll } from '@/lib/animations/gsap-animations';

interface HorizontalScrollerProps {
  children: React.ReactNode;
  className?: string;
}

export default function HorizontalScroller({ children, className = '' }: HorizontalScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    
    if (!container || !track) return;

    // Prevent duplicate ScrollTriggers
    if (container.dataset.scrollInitialized === 'true') {
      return;
    }

    let cleanup: (() => void) | undefined;
    let isMounted = true;

    // Wait for layout to settle
    const timer = setTimeout(() => {
      if (!isMounted) return;
      
      const cards = track.querySelectorAll('.horizontal-card');
      if (cards.length > 0) {
        container.dataset.scrollInitialized = 'true';
        cleanup = createHorizontalScroll(container, track, Array.from(cards));
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (cleanup) cleanup();
      if (container) {
        container.dataset.scrollInitialized = 'false';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`horizontal-scroll-container overflow-hidden ${className}`}
    >
      <div 
        ref={trackRef}
        className="horizontal-scroll-track flex gap-4 w-max"
      >
        {children}
      </div>
    </div>
  );
}
