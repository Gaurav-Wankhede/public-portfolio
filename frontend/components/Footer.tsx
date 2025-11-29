"use client";

import { Github, Linkedin, Mail, Twitter, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <footer className="py-6 sm:py-8"></footer>;
  }

  const { socialLinks } = siteConfig;

  return (
    <footer
      className={`bg-background glass text-foreground py-6 sm:py-8 relative z-10 ${resolvedTheme === "dark" ? "bg-black/20" : "bg-white/30"}`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-3 sm:mb-4">
              <Link href="/" className="flex items-center gap-2">
                {!logoError ? (
                  <Image
                    src="/logo.png"
                    alt={siteConfig.ownerName}
                    width={32}
                    height={32}
                    className="sm:w-10 sm:h-10 rounded-full"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                    {siteConfig.ownerInitials}
                  </div>
                )}
                <span>{siteConfig.ownerName}</span>
              </Link>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {siteConfig.ownerBio}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm">
              {siteConfig.footerQuickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Connect
            </h3>
            <div className="flex flex-wrap gap-4 mt-1 sm:mt-2">
              {socialLinks.github && (
                <Link
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] hover:text-[var(--color-primary)]/80 transition-colors"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </Link>
              )}
              {socialLinks.linkedin && (
                <Link
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] hover:text-[var(--color-primary)]/80 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </Link>
              )}
              {socialLinks.twitter && (
                <Link
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] hover:text-[var(--color-primary)]/80 transition-colors"
                  title="Twitter"
                >
                  <Twitter className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </Link>
              )}
              <Link
                href="/contact"
                className="text-[var(--foreground)] hover:text-[var(--color-primary)]/80 transition-colors"
                title="Contact"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
              </Link>
            </div>
          </div>
        </div>

        {/* Open Source Banner */}
        <div className="mt-6 sm:mt-8 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium">
                This portfolio is open source!
              </span>
            </div>
            <Link
              href="https://github.com/Gaurav-Wankhede/public-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Github className="w-4 h-4" />
              Fork on GitHub
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="h-px w-full bg-border my-4" />
          <p className="text-sm">
            &copy; {siteConfig.copyrightStartYear} - {new Date().getFullYear()}{" "}
            <Link
              href="/"
              className="text-[var(--color-primary)] hover:underline"
            >
              {siteConfig.ownerName}
            </Link>
            . All rights reserved.
          </p>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
            {siteConfig.footerTagline}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
