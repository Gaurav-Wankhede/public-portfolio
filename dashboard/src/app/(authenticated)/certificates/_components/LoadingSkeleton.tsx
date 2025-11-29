'use client';

import React from 'react';

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
          aria-label="Loading certificate"
        >
          {/* Image Skeleton */}
          <div className="h-48 w-full bg-muted animate-pulse" />

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div className="h-6 bg-muted rounded animate-pulse w-4/5" />

            {/* Issuer and Date */}
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded animate-pulse w-2/5" />
              <div className="h-4 bg-muted rounded animate-pulse w-20" />
            </div>

            {/* Link Button */}
            <div className="h-8 bg-muted rounded-md animate-pulse w-full" />

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
