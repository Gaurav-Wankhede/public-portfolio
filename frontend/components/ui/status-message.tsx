"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

interface StatusMessageProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Status Message Component
 * WCAG 2.2 Success Criterion 4.1.3 (Status Messages) - Level AA
 *
 * Uses ARIA live regions to announce status changes to screen readers.
 *
 * Features:
 * - role="status" for polite announcements
 * - role="alert" for urgent error messages
 * - aria-live="polite" or "assertive"
 * - Dismissible with keyboard support
 * - Icon indicators for visual users
 *
 * @example
 * <StatusMessage type="success" message="Form saved successfully!" />
 * <StatusMessage type="error" message="Please fix the errors below" />
 */
export function StatusMessage({
  type,
  message,
  onDismiss,
  className,
}: StatusMessageProps) {
  const { theme } = useTheme();

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const Icon = icons[type];

  const styles = {
    success:
      theme === "dark"
        ? "bg-green-900/50 border-green-700 text-green-300"
        : "bg-green-50 border-green-200 text-green-800",
    error:
      theme === "dark"
        ? "bg-red-900/50 border-red-700 text-red-300"
        : "bg-red-50 border-red-200 text-red-800",
    info:
      theme === "dark"
        ? "bg-blue-900/50 border-blue-700 text-blue-300"
        : "bg-blue-50 border-blue-200 text-blue-800",
    warning:
      theme === "dark"
        ? "bg-yellow-900/50 border-yellow-700 text-yellow-300"
        : "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  return (
    <div
      // Use role="alert" for errors (assertive), "status" for others (polite)
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border",
        "animate-slide-in",
        styles[type],
        className
      )}
    >
      {/* Icon */}
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />

      {/* Message */}
      <p className="flex-1 text-sm font-medium">{message}</p>

      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            "flex-shrink-0 p-1 rounded transition-colors",
            theme === "dark"
              ? "hover:bg-white/10"
              : "hover:bg-black/10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          )}
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/**
 * Toast Container for Status Messages
 * Positioned at top-right of screen
 */
export function StatusToast({
  type,
  message,
  onDismiss,
}: StatusMessageProps) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <StatusMessage
        type={type}
        message={message}
        onDismiss={onDismiss}
        className="shadow-lg"
      />
    </div>
  );
}
