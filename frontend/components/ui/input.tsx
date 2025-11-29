import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

/**
 * Enhanced input component with micro-interactions
 * Features:
 * - Floating label animation
 * - Focus state with border animation
 * - Error states
 * - Icon support
 * - Dark mode support
 * - Follows 8px grid spacing
 *
 * @example
 * <Input label="Email" type="email" />
 * <Input label="Search" icon={<SearchIcon />} />
 * <Input label="Name" error="Name is required" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, icon, className, type = "text", ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      !!props.value || !!props.defaultValue,
    );

    return (
      <div className="w-full space-y-1">
        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full px-4 py-2 border rounded-lg",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-gray-100",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              icon && "pl-10",
              label && "pt-6 pb-2",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500",
              isFocused && !error && "border-blue-500 dark:border-blue-400",
              className,
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label
              className={cn(
                "absolute left-4 pointer-events-none",
                "transition-all duration-200 ease-out",
                "text-gray-500 dark:text-gray-400",
                icon && "left-10",
                isFocused || hasValue
                  ? "top-1.5 text-xs font-medium"
                  : "top-1/2 -translate-y-1/2 text-base",
                isFocused && !error && "text-blue-600 dark:text-blue-400",
                error && "text-red-600 dark:text-red-400",
              )}
            >
              {label}
            </label>
          )}
        </div>

        {/* Helper Text or Error */}
        {(error || helperText) && (
          <p
            className={cn(
              "text-xs px-1",
              "transition-colors duration-200",
              error
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400",
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
