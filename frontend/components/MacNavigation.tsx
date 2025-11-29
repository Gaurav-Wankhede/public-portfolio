"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MacNavigationProps {
  showHomeButton?: boolean;
  showNavButtons?: boolean;
  className?: string;
}

export default function MacNavigation({
  showHomeButton = true,
  showNavButtons = true,
  className,
}: MacNavigationProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const goForward = () => {
    if (typeof window !== "undefined") {
      window.history.forward();
    }
  };

  const goHome = () => {
    router.push("/");
  };

  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-lg", className)}>
        <div className="flex items-center gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 p-2 rounded-lg", className)}>
      {/* Mac-like window buttons */}
      <div
        className="flex items-center gap-2 mr-4"
        role="navigation"
        aria-label="Page navigation controls"
      >
        <button
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          onClick={goBack}
          title="Back"
          aria-label="Navigate to previous page"
        />
        <button
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
          onClick={goHome}
          title="Home"
          aria-label="Navigate to home page"
        />
        <button
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
          onClick={goForward}
          title="Forward"
          aria-label="Navigate to next page"
        />
      </div>

      {/* Navigation buttons */}
      {showNavButtons && (
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className={`p-1 rounded-full ${
              resolvedTheme === "dark"
                ? "hover:bg-gray-800"
                : "hover:bg-gray-100"
            } transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
            title="Back"
            aria-label="Navigate to previous page"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          {showHomeButton && (
            <button
              onClick={goHome}
              className={`p-1 rounded-full ${
                resolvedTheme === "dark"
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-100"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
              title="Home"
              aria-label="Navigate to home page"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          <button
            onClick={goForward}
            className={`p-1 rounded-full ${
              resolvedTheme === "dark"
                ? "hover:bg-gray-800"
                : "hover:bg-gray-100"
            } transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
            title="Forward"
            aria-label="Navigate to next page"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
