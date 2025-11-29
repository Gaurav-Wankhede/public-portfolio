"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Briefcase,
  MessageSquare,
  Mail,
  User,
  FileText,
  Cpu,
} from "lucide-react";

export type LoaderVariant =
  | "projects"
  | "project-detail"
  | "about"
  | "contact"
  | "chat"
  | "default";

interface CardLoaderProps {
  variant?: LoaderVariant;
  title?: string;
  description?: string;
}

const variantConfig: Record<
  LoaderVariant,
  {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
    iconColor: string;
  }
> = {
  projects: {
    icon: Briefcase,
    title: "Loading Projects",
    description: "Fetching projects...",
    gradient: "from-amber-500/20 via-orange-500/10 to-amber-500/20",
    iconColor: "text-amber-500",
  },
  "project-detail": {
    icon: Code2,
    title: "Loading Project",
    description: "Preparing project details...",
    gradient: "from-purple-500/20 via-violet-500/10 to-purple-500/20",
    iconColor: "text-purple-500",
  },
  about: {
    icon: User,
    title: "Loading Profile",
    description: "Loading profile...",
    gradient: "from-blue-500/20 via-cyan-500/10 to-blue-500/20",
    iconColor: "text-blue-500",
  },
  contact: {
    icon: Mail,
    title: "Loading Contact",
    description: "Loading contact info...",
    gradient: "from-green-500/20 via-emerald-500/10 to-green-500/20",
    iconColor: "text-green-500",
  },
  chat: {
    icon: MessageSquare,
    title: "Loading AI Chat",
    description: "Preparing AI assistant...",
    gradient: "from-violet-500/20 via-purple-500/10 to-violet-500/20",
    iconColor: "text-violet-500",
  },

  default: {
    icon: Cpu,
    title: "Loading",
    description: "Please wait...",
    gradient: "from-gray-500/20 via-slate-500/10 to-gray-500/20",
    iconColor: "text-primary",
  },
};

export default function CardLoader({
  variant = "default",
  title,
  description,
}: CardLoaderProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`
          relative overflow-hidden
          w-full max-w-sm
          rounded-2xl
          bg-gradient-to-br ${config.gradient}
          backdrop-blur-xl
          border border-white/10 dark:border-gray-700/30
          shadow-2xl
        `}
      >
        {/* Decorative corner elements - behind content */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className={`absolute -top-4 -right-4 w-24 h-24 ${config.iconColor} opacity-10`}
          >
            <Icon className="w-full h-full" />
          </div>
          <div
            className={`absolute -bottom-4 -left-4 w-20 h-20 ${config.iconColor} opacity-5 rotate-180`}
          >
            <Icon className="w-full h-full" />
          </div>
        </div>

        {/* Animated background glow */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-50 pointer-events-none`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Content Container */}
        <div className="relative z-10 p-8">
          {/* Icon with Spinner Section */}
          <div className="flex flex-col items-center">
            {/* Icon and Spinner Container */}
            <div className="relative w-24 h-24 mb-6">
              {/* Centered Icon Box */}
              <motion.div
                className={`
                  absolute inset-0 m-auto w-16 h-16
                  rounded-xl
                  bg-white/10 dark:bg-gray-800/50
                  backdrop-blur-sm
                  flex items-center justify-center
                  border border-white/20 dark:border-gray-600/30
                `}
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Icon className={`w-8 h-8 ${config.iconColor}`} />
              </motion.div>

              {/* Outer Spinner Ring */}
              <motion.div
                className={`absolute inset-0 rounded-full border-4 border-transparent border-t-current ${config.iconColor}`}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Inner Spinner Ring */}
              <motion.div
                className={`absolute inset-2 rounded-full border-4 border-transparent border-b-current ${config.iconColor} opacity-50`}
                animate={{ rotate: -360 }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* Text Section */}
            <div className="text-center space-y-2">
              {/* Title */}
              <motion.h3
                className="text-xl font-semibold text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {displayTitle}
              </motion.h3>

              {/* Description with animated dots */}
              <motion.p
                className="text-sm text-muted-foreground flex items-center justify-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {displayDescription}
                <span className="flex gap-0.5 ml-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${config.iconColor} bg-current`}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </span>
              </motion.p>
            </div>

            {/* Progress Bar Section */}
            <div className="w-full mt-6">
              <div className="h-1.5 bg-white/10 dark:bg-gray-700/30 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${config.gradient.replace("/20", "/60").replace("/10", "/40")}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
