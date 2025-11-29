'use client';

import React from 'react';
import { FolderOpen, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  isSearching?: boolean;
  searchQuery?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isSearching = false, searchQuery = '' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className={cn(
        'rounded-full p-6 mb-4',
        'bg-muted'
      )}>
        {isSearching ? (
          <Search className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
        ) : (
          <FolderOpen className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
        )}
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {isSearching ? 'No projects found' : 'No projects yet'}
      </h3>

      <p className="text-muted-foreground max-w-md">
        {isSearching ? (
          <>
            No projects match &quot;{searchQuery}&quot;. Try adjusting your search or clear the filter.
          </>
        ) : (
          <>
            Get started by adding your first project to showcase your work.
          </>
        )}
      </p>
    </div>
  );
};
