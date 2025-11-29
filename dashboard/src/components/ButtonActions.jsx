"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ButtonActions() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
      <Link href="/projects" passHref className="w-full sm:w-1/2">
        <Button 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
        >
          View Projects
        </Button>
      </Link>
      <Link href="/certificates" passHref className="w-full sm:w-1/2">
        <Button 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
        >
          View Certificates
        </Button>
      </Link>
    </div>
  );
}
