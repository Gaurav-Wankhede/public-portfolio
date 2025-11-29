"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTheme } from "next-themes";
import { siteConfig } from "@/config/site";

interface CounterProps {
  label: string;
  endValue: number;
  duration?: number;
  delay?: number;
}

const Counter = ({
  label,
  endValue,
  duration = 2000,
  delay = 0,
}: CounterProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (cardRef.current && isHovering) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovering]);

  useEffect(() => {
    if (inView) {
      const steps = 50;
      const increment = endValue / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          if (currentStep < steps) {
            setCount(Math.round(increment * currentStep));
            currentStep++;
          } else {
            setCount(endValue);
            clearInterval(interval);
          }
        }, stepDuration);

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [inView, endValue, duration, delay]);

  // Combined ref handler
  const setRefs = (element: HTMLDivElement | null) => {
    // Set the cardRef
    (cardRef as React.MutableRefObject<HTMLDivElement | null>).current =
      element;
    // Call the inView ref
    ref(element);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center p-6 rounded-xl bg-gray-300/20 animate-pulse">
        <div className="h-10 w-16 bg-gray-400/50 rounded-md mb-2"></div>
        <div className="h-4 w-32 bg-gray-400/50 rounded-md"></div>
      </div>
    );
  }

  return (
    <motion.div
      ref={setRefs}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className={`flex flex-col items-center p-6 rounded-xl backdrop-blur-sm transition-all duration-300 border border-transparent hover:border-amber-500/30 neon-border-hover ${
        resolvedTheme === "dark"
          ? "bg-gray-800/40 hover:shadow-xl hover:shadow-amber-500/10"
          : "bg-white/60 hover:shadow-xl hover:shadow-amber-500/10"
      }`}
      style={{
        // @ts-ignore - CSS custom properties
        "--neon-gradient": isHovering
          ? `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(218, 165, 32, 0.4), rgba(139, 92, 246, 0.2) 50%, transparent 100%)`
          : "transparent",
      }}
    >
      <span
        className={`text-4xl font-bold mb-2 ${
          resolvedTheme === "dark" ? "text-amber-400" : "text-amber-600"
        }`}
      >
        {count}+
      </span>
      <span className="text-sm text-foreground/70 text-center">{label}</span>
    </motion.div>
  );
};

export function ProjectCounter() {
  const [repoCount, setRepoCount] = useState(0);
  const [contributionCount, setContributionCount] = useState(0);
  const [starCount, setStarCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dataFetched = useRef(false);

  useEffect(() => {
    if (!dataFetched.current) {
      const fetchGitHubStats = async () => {
        const githubUsername = siteConfig.githubUsername;
        if (!githubUsername) {
          setIsLoading(false);
          return;
        }

        try {
          // Fetch user profile (repos, followers)
          const userResponse = await fetch(
            `https://api.github.com/users/${githubUsername}`,
          );
          const userData = await userResponse.json();

          // Fetch merged PRs (contributions)
          const prResponse = await fetch(
            `https://api.github.com/search/issues?q=author:${githubUsername}+type:pr+is:merged`,
          );
          const prData = await prResponse.json();

          // Fetch repos to calculate total stars
          const reposResponse = await fetch(
            `https://api.github.com/users/${githubUsername}/repos?per_page=100`,
          );
          const reposData = await reposResponse.json();
          const totalStars = Array.isArray(reposData)
            ? reposData.reduce(
                (sum: number, repo: { stargazers_count: number }) =>
                  sum + (repo.stargazers_count || 0),
                0,
              )
            : 0;

          setRepoCount(userData.public_repos || 0);
          setContributionCount(prData.total_count || 0);
          setStarCount(totalStars);
          setFollowerCount(userData.followers || 0);
        } catch (error) {
          console.error("Error fetching GitHub stats:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchGitHubStats();
      dataFetched.current = true;
    }
  }, []);

  // Don't render if no GitHub username configured
  if (!siteConfig.githubUsername) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-6 rounded-xl bg-gray-300/20 animate-pulse"
          >
            <div className="h-10 w-16 bg-gray-400/50 rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-gray-400/50 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
      <Counter label="GitHub Repositories" endValue={repoCount} delay={0} />
      <Counter
        label="Open Source Contributions"
        endValue={contributionCount}
        delay={200}
      />
      <Counter label="GitHub Stars" endValue={starCount} delay={400} />
      <Counter label="GitHub Followers" endValue={followerCount} delay={600} />
    </div>
  );
}
