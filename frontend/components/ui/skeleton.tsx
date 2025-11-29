import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
}

/**
 * Skeleton loader component for loading states
 * Follows 8px grid spacing and supports dark mode
 *
 * @example
 * <Skeleton className="h-8 w-64" />
 * <Skeleton variant="circular" className="h-12 w-12" />
 * <Skeleton variant="text" className="w-full" />
 */
export function Skeleton({
  variant = "rectangular",
  animation = "pulse",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-700",
        {
          "rounded-full": variant === "circular",
          rounded: variant === "rectangular",
          "rounded h-4": variant === "text",
          "animate-pulse": animation === "pulse",
          "animate-wave": animation === "wave",
        },
        className,
      )}
      {...props}
    />
  );
}

/**
 * Skeleton card component for content loading
 */
export function SkeletonCard() {
  return (
    <div className="card space-y-4">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/4" />
          <Skeleton variant="text" className="w-1/3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton list component for list loading states
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton variant="circular" className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
