"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { Project } from "@/lib/schema"; // Adjust the import based on your project structure
import ProjectCard from "../ProjectCard"; // Import the ProjectCard component
import { useTheme } from "next-themes";

interface InfiniteMovingProjectsProps {
  projects: Project[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingProjects: React.FC<InfiniteMovingProjectsProps> = ({
  projects,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const getDirection = React.useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  }, [direction]);

  const getSpeed = React.useCallback(() => {
    if (containerRef.current) {
      const durationMap = {
        fast: "30s",
        normal: "50s",
        slow: "100s",
      };
      containerRef.current.style.setProperty("--animation-duration", durationMap[speed]);
    }
  }, [speed]);

  const addAnimation = React.useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
 
      scrollerContent.forEach((item, index) => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;
        // Add a custom data attribute to differentiate cloned nodes
        duplicatedItem.setAttribute('data-cloned', 'true');
        duplicatedItem.setAttribute('data-clone-index', index.toString());
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });
 
      getDirection();
      getSpeed();
      
      // Add an inline style for browser compatibility
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50%));
          }
        }
        
        /* The 'reverse' animation-direction will flip this animation when applied */
        /* When animation-direction is 'reverse', it will go from -50% to 0 (left to right) */
        
        .paused-indicator {
          position: relative;
        }
        .paused-indicator::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
          opacity: 1;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, [getDirection, getSpeed]);

  useEffect(() => {
    if (mounted) {
      addAnimation();
    }
  }, [mounted, addAnimation]);


  const handleMouseDown = (e: React.MouseEvent) => {
    if (!pauseOnHover) return; // Don't enable dragging if pause is disabled
    setIsDragging(true);
    setStartX(e.pageX - scrollerRef.current!.offsetLeft);
    setScrollLeft(scrollerRef.current!.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (pauseOnHover && scrollerRef.current) {
      scrollerRef.current.style.animationPlayState = "running";
      if (containerRef.current) {
        containerRef.current.classList.remove('paused-indicator');
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollerRef.current!.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    scrollerRef.current!.scrollLeft = scrollLeft - walk;
  };

  

  if (!mounted) {
    return (
      <div className="relative w-full h-[450px] overflow-hidden">
        <div className="absolute w-full h-full bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Small indicator that projects carousel pauses on hover */}
      <div className="text-center mb-2">
        <span className={`text-xs ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"} italic`}>
          Hover to pause • Click for details
        </span>
      </div>
      
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] transition-all duration-300",
          className,
          "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-transparent after:opacity-0 after:transition-all after:duration-300",
          "paused-indicator:after:bg-purple-500/20 paused-indicator:after:opacity-100"
        )}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap"
          )}
          style={{
            background: 'transparent',
            animation: `scroll var(--animation-duration) linear infinite var(--animation-direction)`,
            animationPlayState: "running"
          }}
          onMouseEnter={() => {
            if (pauseOnHover && scrollerRef.current) {
              scrollerRef.current.style.animationPlayState = "paused";
              if (containerRef.current) {
                containerRef.current.classList.add('paused-indicator');
              }
            }
          }}
          onMouseLeave={() => {
            if (pauseOnHover && scrollerRef.current) {
              scrollerRef.current.style.animationPlayState = "running";
              if (containerRef.current) {
                containerRef.current.classList.remove('paused-indicator');
              }
            }
          }}
        >
          {projects.map((project) => (
            <li key={project.slug} className={`flex-shrink-0 group transition-transform duration-300 hover:scale-[1.02]`}>
              <div className="relative">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-xl"></div>
                </div>
                <ProjectCard project={project} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 