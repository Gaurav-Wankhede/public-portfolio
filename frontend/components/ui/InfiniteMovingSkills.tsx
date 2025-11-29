"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface SkillItem {
  name: string;
  logo: string;
}

interface InfiniteMovingSkillsProps {
  items: SkillItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingSkills = ({
  items,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: InfiniteMovingSkillsProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDirection = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse",
      );
    }
  }, [direction]);

  const getSpeed = useCallback(() => {
    if (containerRef.current) {
      const durationMap = {
        fast: "15s",
        normal: "25s",
        slow: "35s",
      };
      containerRef.current.style.setProperty(
        "--animation-duration",
        durationMap[speed],
      );
    }
  }, [speed]);

  const addAnimation = useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      // Clone items for seamless loop
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;
        duplicatedItem.setAttribute("aria-hidden", "true");
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
    }
  }, [getDirection, getSpeed]);

  useEffect(() => {
    if (mounted) {
      addAnimation();
    }
  }, [mounted, addAnimation]);

  const currentTheme = mounted ? resolvedTheme : "dark";

  if (!mounted) {
    return (
      <div className="relative w-full h-24 overflow-hidden">
        <div className="absolute w-full h-full bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]",
        className,
      )}
    >
      <div
        ref={scrollerRef}
        className={cn(
          "flex gap-4 py-4 w-max flex-nowrap",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
        style={{
          animation: `scroll var(--animation-duration, 25s) linear infinite var(--animation-direction, forwards)`,
          willChange: "transform",
        }}
      >
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex-shrink-0 flex flex-col items-center justify-center px-3"
          >
            <div
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl",
                currentTheme === "dark" ? "bg-gray-800/60" : "bg-white/90",
              )}
            >
              <Image
                src={item.logo}
                alt={item.name}
                width={28}
                height={28}
                className="object-contain pointer-events-none select-none"
                draggable={false}
                loading="lazy"
                unoptimized
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-medium whitespace-nowrap mt-2",
                "opacity-70 hover:opacity-100 transition-opacity duration-200",
                currentTheme === "dark" ? "text-gray-400" : "text-gray-500",
              )}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
