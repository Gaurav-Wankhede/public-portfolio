"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface InteractiveCardProps {
  children: React.ReactNode;
  hover?: "lift" | "glow" | "scale" | "none";
  className?: string;
  onClick?: () => void;
}

/**
 * Interactive card component with micro-interactions
 * Features:
 * - Multiple hover effects (lift, glow, scale)
 * - Smooth transitions
 * - Dark mode support
 * - 8px grid spacing
 * - Accessible focus states
 *
 * @example
 * <InteractiveCard hover="lift">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </InteractiveCard>
 */
export function InteractiveCard({
  children,
  hover = "lift",
  className,
  onClick,
}: InteractiveCardProps) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const hoverEffects = {
    lift: cn(
      "transition-all duration-300 ease-out",
      isHovered && "transform -translate-y-2 shadow-xl"
    ),
    glow: cn(
      "transition-all duration-300 ease-out",
      isHovered &&
        (theme === "dark"
          ? "shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          : "shadow-[0_0_30px_rgba(59,130,246,0.3)]")
    ),
    scale: cn(
      "transition-all duration-300 ease-out",
      isHovered && "transform scale-105 shadow-lg"
    ),
    none: "",
  };

  return (
    <div
      className={cn(
        "card cursor-pointer",
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-300",
        hoverEffects[hover],
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Product card with hover animation
 */
export function ProductCardHover({
  image,
  title,
  price,
  onAddToCartAction,
}: {
  image: string;
  title: string;
  price: string;
  onAddToCartAction?: () => void;
}) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border",
        "transition-all duration-300",
        theme === "dark" ? "border-gray-700" : "border-gray-300"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={image}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            isHovered && "scale-110"
          )}
        />

        {/* Overlay on Hover */}
        <div
          className={cn(
            "absolute inset-0 bg-black bg-opacity-0 transition-all duration-300",
            isHovered && "bg-opacity-20"
          )}
        />

        {/* Quick Action Button */}
        <button
          onClick={onAddToCartAction}
          className={cn(
            "absolute bottom-4 left-1/2 transform -translate-x-1/2",
            "px-6 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
            "rounded-lg font-medium shadow-lg",
            "transition-all duration-300",
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          Add to Cart
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3
          className={cn(
            "font-semibold transition-colors duration-200",
            theme === "dark" ? "text-gray-100" : "text-gray-900",
            isHovered && "text-blue-600 dark:text-blue-400"
          )}
        >
          {title}
        </h3>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {price}
        </p>
      </div>
    </div>
  );
}
