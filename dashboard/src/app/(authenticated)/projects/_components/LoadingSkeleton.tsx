'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-card border rounded-lg overflow-hidden"
          aria-label="Loading project"
        >
          {/* Image Skeleton */}
          <div className="h-48 w-full bg-muted animate-pulse" />

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Title and Date */}
            <div className="flex items-start justify-between gap-2">
              <div className="h-6 bg-muted rounded animate-pulse flex-1" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-6 bg-muted rounded-full animate-pulse',
                    i === 0 ? 'w-16' : i === 1 ? 'w-20' : i === 2 ? 'w-14' : 'w-18'
                  )}
                />
              ))}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-7 w-20 bg-muted rounded-md animate-pulse" />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t">
              <div className="h-9 bg-muted rounded-md animate-pulse flex-1" />
              <div className="h-9 bg-muted rounded-md animate-pulse flex-1" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
