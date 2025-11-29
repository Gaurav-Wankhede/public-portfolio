"use client";

export const runtime = "edge";

import React, { useRef } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AskAnything from "@/components/chat/AskAnything";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AskUsernamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 relative">
        {/* Background */}
        <div
          className={cn(
            "fixed inset-0",
            isDark ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white",
          )}
        />

        {/* Grid pattern */}
        <div
          className={cn(
            "fixed inset-0 bg-[url(/grid.svg)] bg-center",
            "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]",
            isDark ? "opacity-20" : "opacity-40",
          )}
        />

        {/* Animated gradient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className={cn(
              "absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full",
              "bg-gradient-to-br from-blue-500/30 to-purple-500/30",
              "blur-[100px] animate-pulse",
            )}
          />
          <div
            className={cn(
              "absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full",
              "bg-gradient-to-tr from-cyan-500/20 to-blue-500/20",
              "blur-[100px] animate-pulse",
              "animation-delay-2000",
            )}
          />
        </div>

        <motion.main
          ref={containerRef}
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col min-h-screen"
        >
          {/* Compact Header */}
          <motion.div variants={item} className="text-center py-6 px-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                "border backdrop-blur-sm",
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-black/5 border-black/10",
              )}
            >
              <Sparkles
                className={cn(
                  "w-4 h-4",
                  isDark ? "text-blue-400" : "text-blue-600",
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                AI-Powered Assistant
              </span>
            </motion.div>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            variants={item}
            className="flex-1 flex flex-col mx-auto w-full max-w-4xl px-2 sm:px-4 pb-4"
          >
            <AskAnything suggestedPrompts={siteConfig.suggestedPrompts} />
          </motion.div>
        </motion.main>

        <style jsx global>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.5;
            }
          }

          .animate-pulse {
            animation: pulse 4s ease-in-out infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    </div>
  );
}
