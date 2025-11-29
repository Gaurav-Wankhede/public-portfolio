"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonIcon, SunIcon, Menu, Github } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const routes = [
    { path: "/projects", label: "Projects" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const themeButtonClass = `rounded-full backdrop-blur-lg ${
    resolvedTheme === "dark"
      ? "bg-[var(--color-background)]/50 text-white"
      : "bg-[var(--color-background)]/30 text-black"
  }`;

  return (
    <nav className="sticky top-0 z-[100] bg-transparent">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center md:justify-center">
        {isClient && (
          <>
            {isMobile ? (
              <>
                <Link href="/" className="text-xl font-bold">
                  {!logoError ? (
                    <Image
                      src="/logo.png"
                      alt="Portfolio"
                      width={40}
                      height={40}
                      onError={() => setLogoError(true)}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      P
                    </div>
                  )}
                </Link>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className={`${themeButtonClass} mx-2 sm:mx-4 mr-2`}
                    aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
                  >
                    {resolvedTheme === "dark" ? (
                      <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden"
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </div>
              </>
            ) : (
              <div
                className={`flex items-center glass rounded-full shadow-lg backdrop-blur-lg ${resolvedTheme === "dark" ? "dark:shadow-white/20" : "shadow-light-theme"} px-3 sm:px-6 py-2`}
              >
                <Link
                  href="/"
                  className="text-xl sm:text-2xl font-bold mr-2 sm:mr-4"
                >
                  {!logoError ? (
                    <Image
                      src="/logo.png"
                      alt="Portfolio"
                      width={40}
                      height={40}
                      onError={() => setLogoError(true)}
                      className="rounded-full hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-lg shadow-lg hover:scale-110 transition-transform">
                      P
                    </div>
                  )}
                </Link>
                {routes.map((route) => (
                  <Link
                    key={`nav-${route.path}`}
                    href={route.path}
                    className={cn(
                      "text-sm sm:text-base px-2 py-1 sm:px-3 sm:py-2",
                      pathname === route.path
                        ? "font-semibold"
                        : `hover:text-[var(--color-primary)]`,
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
                <Link
                  href="https://github.com/Gaurav-Wankhede/public-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 sm:ml-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-purple-500 text-white text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity group"
                  title="Star this repo on GitHub"
                >
                  <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Star on GitHub</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className={`${themeButtonClass} ml-2 sm:ml-4`}
                  aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
                >
                  {resolvedTheme === "dark" ? (
                    <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      {isMobile && isMenuOpen && (
        <div
          className={`absolute top-full left-0 right-0 backdrop-filter backdrop-blur-xl p-4 animate-in slide-in-from-top-5 duration-200 ${
            resolvedTheme === "dark"
              ? "bg-[var(--color-background)]/80 text-white border-t border-gray-800"
              : "bg-white/95 text-gray-800 border-t border-gray-200 shadow-lg"
          }`}
        >
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.path}
              className={cn(
                `block py-2 px-4 text-lg transition-colors ${
                  resolvedTheme === "dark" ? "text-white" : "text-gray-800"
                }`,
                pathname === route.path
                  ? `text-[var(--color-primary)] font-semibold`
                  : `hover:text-[var(--color-primary)]`,
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {route.label}
            </Link>
          ))}
          <Link
            href="https://github.com/Gaurav-Wankhede/public-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-2 px-4 mt-2 text-lg text-amber-500 hover:text-amber-400 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Github className="h-5 w-5" />
            Star on GitHub
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
