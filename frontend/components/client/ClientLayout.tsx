"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import Loader from "@/components/ui/Loader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/" || pathname === null;

  // Start with loading=false for landing page, true for other pages
  const [loading, setLoading] = useState(!isLanding);

  useEffect(() => {
    // For non-landing pages, hide loader after brief delay
    if (!isLanding && loading) {
      const timer = setTimeout(() => setLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isLanding, loading]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        {loading && !isLanding ? (
          <Loader />
        ) : (
          <div className="container mx-auto">{children}</div>
        )}
      </main>
      <Footer />
      <Toaster />
    </ThemeProvider>
  );
}
