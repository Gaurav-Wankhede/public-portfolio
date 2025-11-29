"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface ImageCarouselProps {
  images: string[];
  interval?: number;
}

// Default placeholder image when no project image is available
const PLACEHOLDER_IMAGE = "/placeholder-project.svg";

export function ImageCarousel({
  images: rawImages,
  interval = 5000,
}: ImageCarouselProps) {
  // Use placeholder if no images provided
  const images =
    rawImages && rawImages.length > 0 ? rawImages : [PLACEHOLDER_IMAGE];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? resolvedTheme || theme : "light";

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, isPaused]);

  const isVideo = (src: string) => {
    return src.match(/\.(mp4|webm|ogg)$/i);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsPaused(!isPaused);
  };

  const MediaContent = ({
    source,
    index,
  }: {
    source: string;
    index: number;
  }) => (
    <div
      className={cn(
        "absolute w-full h-full transition-transform duration-500 ease-in-out",
        isFullscreen ? "cursor-zoom-out" : "cursor-zoom-in",
      )}
      style={{
        transform: `translateX(${100 * (index - currentIndex)}%)`,
      }}
      onClick={toggleFullscreen}
    >
      {isVideo(source) ? (
        <video
          src={source}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain rounded-lg"
        />
      ) : (
        <Image
          src={source}
          alt={`Project image ${index + 1}`}
          fill
          className="rounded-lg object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index === currentIndex}
        />
      )}
    </div>
  );

  const CarouselControls = () => (
    <>
      <Button
        variant="outline"
        size="icon"
        className={`absolute left-4 top-1/2 -translate-y-1/2 ${currentTheme === "dark" ? "bg-gray-800/80" : "bg-white/80"} backdrop-blur-sm ${currentTheme === "dark" ? "hover:bg-gray-700/90" : "hover:bg-gray-100/90"} z-20`}
        onClick={(e) => {
          e.stopPropagation();
          handlePrevious();
        }}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`absolute right-4 top-1/2 -translate-y-1/2 ${currentTheme === "dark" ? "bg-gray-800/80" : "bg-white/80"} backdrop-blur-sm ${currentTheme === "dark" ? "hover:bg-gray-700/90" : "hover:bg-gray-100/90"} z-20`}
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`absolute top-4 right-4 ${currentTheme === "dark" ? "bg-gray-800/80" : "bg-white/80"} backdrop-blur-sm ${currentTheme === "dark" ? "hover:bg-gray-700/90" : "hover:bg-gray-100/90"} z-20`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
    </>
  );

  const Indicators = () => (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {images.map((_, index) => (
        <button
          key={`carousel-indicator-${index}`}
          className={cn(
            "w-2 h-2 rounded-full transition-all",
            index === currentIndex
              ? `${currentTheme === "dark" ? "bg-white/90" : "bg-gray-800/90"} w-4`
              : `${currentTheme === "dark" ? "bg-white/50" : "bg-gray-800/50"} ${currentTheme === "dark" ? "hover:bg-white/70" : "hover:bg-gray-800/70"}`,
          )}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(index);
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "relative w-full overflow-hidden rounded-lg",
          !isFullscreen && "h-[400px]",
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {images.map((source, index) => (
          <MediaContent
            key={
              typeof source === "string"
                ? `carousel-${source}`
                : `carousel-img-${index}`
            }
            source={source}
            index={index}
          />
        ))}
        <CarouselControls />
        <Indicators />
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 ${currentTheme === "dark" ? "bg-gray-900/95" : "bg-gray-100/95"} backdrop-blur-sm z-50 flex items-center justify-center`}
            onClick={toggleFullscreen}
          >
            <div className="relative w-full h-full max-w-7xl mx-auto p-4">
              <Button
                variant="outline"
                size="icon"
                className={`absolute top-4 right-4 z-50 ${currentTheme === "dark" ? "bg-gray-800/80" : "bg-white/80"}`}
                onClick={toggleFullscreen}
              >
                <X className="h-4 w-4" />
              </Button>
              {images.map((source, index) => (
                <MediaContent
                  key={
                    typeof source === "string"
                      ? `fullscreen-carousel-${source}`
                      : `fullscreen-carousel-img-${index}`
                  }
                  source={source}
                  index={index}
                />
              ))}
              <CarouselControls />
              <Indicators />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
