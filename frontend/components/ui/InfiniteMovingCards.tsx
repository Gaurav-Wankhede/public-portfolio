"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface InfiniteMovingCardsProps {
  items: {
    quote: string;
    name: string;
    image_url: string;
    title: string;
    social_icons: {
      name: string;
      icon: React.ElementType;
      link: string;
    }[];
  }[];
  direction?: "left" | "right";
  speed: "fast" | "normal" | "slow";
  pauseOnHover: boolean;
  className: string;
}

export const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items,
  direction = "left",
  pauseOnHover = true,
  speed = "slow",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse",
      );
      const durationMap = { fast: "20s", normal: "40s", slow: "80s" };
      containerRef.current.style.setProperty(
        "--animation-duration",
        durationMap[speed],
      );
    }
  }, [direction, speed]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (hoveredIndex !== null && cardRefs.current[hoveredIndex]) {
        const rect = cardRefs.current[hoveredIndex]!.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredIndex]);

  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...items, ...items];

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        className={cn(
          "flex min-w-full shrink-0 gap-6 py-6 w-max flex-nowrap animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {duplicatedItems.map((item, index) => (
          <li
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "w-[350px] sm:w-[450px] md:w-[500px] max-w-full relative rounded-xl border flex-shrink-0 backdrop-blur-md flex flex-row min-h-[180px] overflow-hidden transition-all duration-300 group neon-border-hover",
              theme === "dark"
                ? "bg-gray-900/50 border-gray-700/30"
                : "bg-white/70 border-gray-200/50",
            )}
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow:
                theme === "dark"
                  ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                  : "0 4px 20px rgba(0, 0, 0, 0.1)",
              // @ts-ignore - CSS custom properties
              "--neon-gradient":
                hoveredIndex === index
                  ? `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0.4), transparent 100%)`
                  : "transparent",
            }}
            key={`testimonial-${item.name.replace(/\s+/g, "-")}-${index}`}
          >
            {/* Profile Section - 35% width on the left */}
            <div
              className={cn(
                "w-[35%] flex flex-col justify-center items-center p-4 border-r",
                theme === "dark"
                  ? "border-gray-700/30 bg-gray-800/30"
                  : "border-gray-200/50 bg-gray-50/50",
              )}
            >
              <div className="flex flex-col items-center">
                <div className="rounded-full p-0.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover w-[60px] h-[60px] border-2 border-gray-200/10"
                  />
                </div>
                <div className="mt-3 text-center">
                  <h3
                    className={cn(
                      "text-sm font-semibold leading-tight",
                      theme === "dark" ? "text-white" : "text-gray-800",
                    )}
                  >
                    {item.name}
                  </h3>
                  <p
                    className={cn(
                      "text-xs mt-1 leading-tight",
                      theme === "dark" ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {item.title}
                  </p>
                  <div className="flex mt-2 justify-center gap-2">
                    {item.social_icons.map((icon, iconIndex) =>
                      icon.link ? (
                        <a
                          href={icon.link}
                          key={`${item.name.replace(/\s+/g, "-")}-${icon.name}-${iconIndex}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-all duration-300 hover:scale-110 hover:text-[var(--color-primary)]"
                        >
                          <icon.icon
                            className={cn(
                              "w-3.5 h-3.5",
                              theme === "dark"
                                ? "text-gray-500"
                                : "text-gray-400",
                            )}
                          />
                        </a>
                      ) : null,
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Content - 65% width on the right */}
            <div className="w-[65%] p-4 flex items-center">
              <blockquote className="relative">
                <span
                  className={cn(
                    "absolute -top-2 -left-1 text-3xl font-serif",
                    theme === "dark" ? "text-gray-600" : "text-gray-300",
                  )}
                >
                  &ldquo;
                </span>
                <p
                  className={cn(
                    "text-sm leading-relaxed pl-4 pr-2",
                    theme === "dark" ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {item.quote}
                </p>
                <span
                  className={cn(
                    "absolute -bottom-4 right-0 text-3xl font-serif",
                    theme === "dark" ? "text-gray-600" : "text-gray-300",
                  )}
                >
                  &rdquo;
                </span>
              </blockquote>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
