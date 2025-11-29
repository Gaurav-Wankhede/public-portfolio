"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import RotatingText from "@/components/ui/RotatingText";
import TypewriterText from "@/components/ui/TypewriterText";
import StaggeredList from "@/components/ui/StaggeredList";
import {
  Download,
  Brain,
  ChevronRight,
  Mail,
  TrendingUp,
  Zap,
  Users,
  Sparkles,
  ArrowUp,
} from "lucide-react";
const profileImage = "/profile.png";
import * as Dialog from "@radix-ui/react-dialog";
import { ProjectCounter } from "@/components/ProjectCounter";
import { motion } from "framer-motion";
import Script from "next/script";
import { InfiniteMovingSkills } from "@/components/ui/InfiniteMovingSkills";
import SafeInfiniteMovingProjects from "@/components/SafeInfiniteMovingProjects";
import { useTheme } from "next-themes";
import {
  skillsAIML,
  skillsWebDev,
  skillsBackend,
  skillsDevOps,
  techStackCategories,
} from "@/data/skills";
import { BarChart3, Layout, Server, Cloud, Wrench, Code2 } from "lucide-react";
import { homeJsonLd, websiteJsonLd } from "@/lib/seo";

const services = [
  {
    Icon: Brain,
    title: "AI-Powered Solutions",
    description:
      "Transform your business with cutting-edge AI. From concept to implementation, bringing ideas to life.",
  },
  {
    Icon: TrendingUp,
    title: "Data-Driven Strategies",
    description:
      "Unlock hidden potential in your data. Apply insights to drive business growth.",
  },
  {
    Icon: Zap,
    title: "Rapid Prototyping & MVP",
    description:
      "Turn ideas into reality fast. Get your project off the ground quickly.",
  },
  {
    Icon: Users,
    title: "Enhanced User Experiences",
    description:
      "Delight your customers with personalized AI-powered solutions.",
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  aiLLM: Brain,
  dataScience: BarChart3,
  frontend: Layout,
  backend: Server,
  devOps: Cloud,
  tools: Wrench,
};

export default function LandingClientUI() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [hoveredServiceIndex, setHoveredServiceIndex] = useState<number | null>(
    null,
  );
  const [serviceCardMousePosition, setServiceCardMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const serviceCardRefs = useRef<(HTMLElement | null)[]>([]);

  const [hoveredTechIndex, setHoveredTechIndex] = useState<number | null>(null);
  const [techCardMousePosition, setTechCardMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const techCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDownloadCV = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (
        hoveredServiceIndex !== null &&
        serviceCardRefs.current[hoveredServiceIndex]
      ) {
        const rect =
          serviceCardRefs.current[hoveredServiceIndex]!.getBoundingClientRect();
        setServiceCardMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
      if (hoveredTechIndex !== null && techCardRefs.current[hoveredTechIndex]) {
        const rect =
          techCardRefs.current[hoveredTechIndex]!.getBoundingClientRect();
        setTechCardMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredServiceIndex, hoveredTechIndex]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 backdrop-blur-xl border border-white/10 dark:border-gray-700/30 shadow-2xl p-10">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 animate-pulse mb-6 ring-4 ring-amber-500/20" />
            <div className="h-10 w-56 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg animate-pulse mb-4" />
            <div className="h-5 w-40 bg-gray-500/20 rounded-md animate-pulse mb-6" />
            <div className="h-8 w-44 bg-green-500/10 rounded-full animate-pulse mb-8 border border-green-500/20" />
            <div className="flex gap-4">
              <div className="h-12 w-36 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-full animate-pulse" />
              <div className="h-12 w-32 bg-gray-500/10 rounded-full animate-pulse border border-gray-500/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[9999] bg-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-[#daa520] via-[#f0c020] to-[#daa520]"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.8,
          pointerEvents: showBackToTop ? "auto" : "none",
        }}
        transition={{ duration: 0.2 }}
        className={`fixed bottom-8 right-8 z-[9998] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          resolvedTheme === "dark"
            ? "bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-700"
            : "bg-white/80 hover:bg-white text-gray-800 border border-gray-200"
        } backdrop-blur-sm`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className={`absolute inset-0 ${resolvedTheme === "dark" ? "animate-gradient-background-dark" : "animate-gradient-background-light"}`}
        />
        <div className="absolute inset-0 grid-background opacity-30 dark:opacity-50 grid-fade-mask" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 w-full ${resolvedTheme === "dark" ? "text-white" : "text-black"}`}
      >
        <Script
          id="person-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
        />
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <div className="relative container">
          {/* Hero Section */}
          <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center z-10 max-w-3xl mx-auto"
            >
              {/* Profile Image */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className={`relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto group mb-6 ${resolvedTheme === "dark" ? "ring-white/10" : "ring-gray-100"}`}
              >
                <div
                  className={`relative w-full h-full rounded-full overflow-hidden shadow-xl ${resolvedTheme === "dark" ? "ring-4 ring-white/10" : "ring-4 ring-[#daa520]/30"} transition-all duration-300 group-hover:ring-primary/50 group-hover:scale-105`}
                >
                  <Image
                    src={profileImage}
                    alt="Developer Profile"
                    fill
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    priority
                  />
                </div>
              </motion.div>

              {/* Name - Customize this */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 ${resolvedTheme === "dark" ? "animate-gradient-text-dark" : "animate-gradient-text-light"}`}
              >
                Your Name Here
              </motion.h1>

              {/* Rotating Role - Customize these */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-base sm:text-lg md:text-xl text-foreground/80 mb-4 min-h-[1.75rem] sm:min-h-[2rem]"
              >
                <RotatingText
                  texts={[
                    "Full-Stack Developer",
                    "AI Engineer",
                    "Data Scientist",
                    "Software Architect",
                  ]}
                  displayDuration={3000}
                  transitionDuration={600}
                  animationType="fade-slide"
                />
              </motion.p>

              {/* Tagline - Customize this */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-sm sm:text-base text-foreground/60 mb-6 max-w-xl mx-auto"
              >
                Building innovative solutions with cutting-edge technology
              </motion.p>

              {/* Availability Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex justify-center mb-8"
              >
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${resolvedTheme === "dark" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-green-500/10 text-green-600 border border-green-500/20"}`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Available for Projects
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button
                  onClick={handleDownloadCV}
                  aria-label="Download CV"
                  className="group cursor-pointer z-10 flex items-center gap-2 bg-gradient-to-r from-[#daa520] via-[#f0c020] to-[#daa520] bg-[length:200%_100%] text-white hover:bg-right-bottom transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] rounded-full py-3 px-6 font-semibold border-2 border-[#daa520]/30 hover:border-[#daa520] hover:scale-105"
                >
                  <Download className="h-5 w-5 group-hover:animate-bounce" />
                  Download CV
                </Button>
                <Link
                  href="/projects"
                  aria-label="View Projects"
                  className="group z-10 flex items-center gap-2 bg-gradient-to-r from-transparent to-transparent hover:from-[#daa520]/10 hover:to-[#f0c020]/10 text-primary border-2 border-primary/30 hover:border-primary hover:text-[#daa520] transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] rounded-full py-3 px-6 font-semibold backdrop-blur-sm hover:scale-105"
                >
                  <Sparkles className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  View Projects
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight * 0.9,
                    behavior: "smooth",
                  })
                }
              >
                <span
                  className={`text-xs font-medium ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  Scroll to explore
                </span>
                <div
                  className={`w-6 h-10 rounded-full border-2 ${resolvedTheme === "dark" ? "border-gray-600" : "border-gray-400"} flex justify-center pt-2 group-hover:border-primary transition-colors`}
                >
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`w-1.5 h-1.5 rounded-full ${resolvedTheme === "dark" ? "bg-gray-400" : "bg-gray-500"} group-hover:bg-primary transition-colors`}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          <main>
            {/* Project Highlights Section */}
            <section
              aria-labelledby="projects-title"
              className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${
                    resolvedTheme === "dark"
                      ? "bg-amber-500/30"
                      : "bg-amber-400/20"
                  }`}
                />
                <div
                  className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${
                    resolvedTheme === "dark"
                      ? "bg-purple-500/30"
                      : "bg-purple-400/20"
                  }`}
                />
              </div>

              <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
                      resolvedTheme === "dark"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 inline-block mr-2" />
                    Featured Work
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className={`relative text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 inline-block w-full ${resolvedTheme === "dark" ? "animate-gradient-text-dark" : "animate-gradient-text-light"}`}
                  >
                    Projects
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto"
                  >
                    Explore my diverse portfolio of projects and achievements
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-16"
                >
                  <ProjectCounter />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={`relative rounded-3xl p-6 sm:p-8 mb-10 ${
                    resolvedTheme === "dark"
                      ? "bg-gradient-to-b from-gray-800/30 to-gray-900/30 border border-gray-700/30"
                      : "bg-gradient-to-b from-white/50 to-gray-50/50 border border-gray-200/50"
                  } backdrop-blur-sm`}
                >
                  <SafeInfiniteMovingProjects
                    pauseOnHover={true}
                    speed="slow"
                    direction="left"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex justify-center"
                >
                  <Link
                    href="/projects"
                    className="group relative z-10 flex items-center justify-center gap-2 bg-gradient-to-r from-[#daa520] via-[#f0c020] to-[#daa520] bg-[length:200%_100%] text-white hover:bg-right-bottom transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] rounded-full py-3.5 px-8 font-semibold border-2 border-[#daa520]/30 hover:border-[#daa520] hover:scale-105"
                  >
                    View All Projects
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* Services Section */}
            <section
              aria-labelledby="services-title"
              className="relative py-20 px-4 sm:px-6 overflow-hidden"
            >
              <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`relative text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 inline-block w-full ${resolvedTheme === "dark" ? "animate-gradient-text-dark" : "animate-gradient-text-light"}`}
                  >
                    <TypewriterText
                      text="Innovative Solutions & Insights"
                      speed={40}
                      delay={0.5}
                    />
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-lg sm:text-xl text-foreground/70 mb-4 sm:mb-6"
                  >
                    Transforming businesses with AI-driven strategies
                  </motion.p>
                </motion.div>
                <StaggeredList
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                  staggerDelay={150}
                  animation="fade-up"
                  duration={600}
                >
                  {services.map((service, index) => (
                    <article
                      key={service.title}
                      ref={(el) => {
                        serviceCardRefs.current[index] = el;
                      }}
                      onMouseEnter={() => setHoveredServiceIndex(index)}
                      onMouseLeave={() => setHoveredServiceIndex(null)}
                      className={`group relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${resolvedTheme === "dark" ? "bg-gray-800/40 shadow-xl hover:shadow-2xl" : "bg-white/60 shadow-lg hover:shadow-xl"} backdrop-blur-md border border-gray-200/20 dark:border-gray-700/20 neon-border-hover`}
                      style={{
                        // @ts-ignore
                        "--neon-gradient":
                          hoveredServiceIndex === index
                            ? `radial-gradient(circle 200px at ${serviceCardMousePosition.x}px ${serviceCardMousePosition.y}px, rgba(14, 165, 233, 0.4), transparent 100%)`
                            : "transparent",
                      }}
                    >
                      <div className="relative">
                        <div
                          className={`w-14 h-14 mb-4 p-3 rounded-xl ${resolvedTheme === "dark" ? "bg-primary/20 text-[#daa520]" : "bg-primary/20 text-[#daa520]"} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                        >
                          <service.Icon
                            className="w-full h-full"
                            aria-hidden="true"
                          />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-foreground/90 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-foreground/60 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </StaggeredList>
              </div>
            </section>

            {/* Tech Stack Section */}
            <section
              aria-labelledby="tech-stack-title"
              className="relative py-24 px-4 sm:px-6 overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${
                    resolvedTheme === "dark"
                      ? "bg-purple-500/30"
                      : "bg-purple-400/20"
                  }`}
                />
                <div
                  className={`absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-20 ${
                    resolvedTheme === "dark"
                      ? "bg-amber-500/20"
                      : "bg-amber-400/15"
                  }`}
                />
              </div>

              <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
                      resolvedTheme === "dark"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    Tech Arsenal
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className={`relative text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 inline-block w-full ${resolvedTheme === "dark" ? "animate-gradient-text-dark" : "animate-gradient-text-light"}`}
                  >
                    Cutting-Edge Tech Stack
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto"
                  >
                    Leveraging advanced technologies to build tomorrow&apos;s
                    solutions today
                  </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(techStackCategories).map(
                    ([key, category], index) => {
                      const IconComponent = categoryIcons[key] || Code2;
                      return (
                        <motion.div
                          key={key}
                          ref={(el) => {
                            techCardRefs.current[index] = el;
                          }}
                          onMouseEnter={() => setHoveredTechIndex(index)}
                          onMouseLeave={() => setHoveredTechIndex(null)}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className={`group relative p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-md hover:scale-[1.02] overflow-hidden ${
                            resolvedTheme === "dark"
                              ? "bg-gray-800/50 border border-gray-700/30"
                              : "bg-white/70 border border-gray-200/50"
                          } neon-border-hover`}
                          style={{
                            // @ts-expect-error
                            "--neon-gradient":
                              hoveredTechIndex === index
                                ? `radial-gradient(circle 250px at ${techCardMousePosition.x}px ${techCardMousePosition.y}px, rgba(218, 165, 32, 0.4), rgba(139, 92, 246, 0.2) 50%, transparent 100%)`
                                : "transparent",
                          }}
                        >
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${category.gradient} pointer-events-none`}
                            style={{
                              opacity: hoveredTechIndex === index ? 0.05 : 0,
                            }}
                          />

                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-5">
                              <div
                                className={`p-2.5 rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg`}
                              >
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <h3
                                className={`text-lg font-semibold ${
                                  resolvedTheme === "dark"
                                    ? "text-white"
                                    : "text-foreground/90"
                                }`}
                              >
                                {category.title}
                              </h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {category.skills.map((skill, skillIndex) => (
                                <motion.span
                                  key={skill}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    delay: index * 0.1 + skillIndex * 0.03,
                                    duration: 0.3,
                                  }}
                                  whileHover={{ scale: 1.08, y: -2 }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-default border ${
                                    resolvedTheme === "dark"
                                      ? "bg-gray-700/50 text-gray-200 border-gray-600/30 hover:bg-gray-600/50 hover:border-amber-500/30 hover:text-amber-200"
                                      : "bg-gray-100/80 text-gray-700 border-gray-200/50 hover:bg-amber-50 hover:border-amber-300/50 hover:text-amber-700"
                                  }`}
                                >
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      );
                    },
                  )}
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section
              aria-labelledby="skills-title"
              className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${
                    resolvedTheme === "dark"
                      ? "bg-gradient-to-br from-purple-500/40 to-transparent"
                      : "bg-gradient-to-br from-purple-400/30 to-transparent"
                  }`}
                />
              </div>

              <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
                      resolvedTheme === "dark"
                        ? "bg-gradient-to-r from-purple-500/10 to-amber-500/10 text-amber-300 border border-amber-500/20"
                        : "bg-gradient-to-r from-purple-500/10 to-amber-500/10 text-amber-600 border border-amber-500/20"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Technologies I Work With
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className={`relative text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 inline-block w-full ${resolvedTheme === "dark" ? "animate-gradient-text-dark" : "animate-gradient-text-light"}`}
                  >
                    Skills & Expertise
                  </motion.h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className={`relative rounded-3xl p-8 sm:p-10 ${
                    resolvedTheme === "dark"
                      ? "bg-gradient-to-b from-gray-800/40 to-gray-900/40 border border-gray-700/30 shadow-2xl shadow-purple-500/5"
                      : "bg-gradient-to-b from-white/60 to-gray-50/60 border border-gray-200/50 shadow-2xl shadow-purple-500/10"
                  }`}
                >
                  <div className="relative mb-10">
                    <InfiniteMovingSkills
                      items={[...skillsAIML, ...skillsWebDev]}
                      direction="left"
                      speed="slow"
                      pauseOnHover={true}
                    />
                  </div>

                  <div
                    className={`h-px mx-auto max-w-md mb-10 ${
                      resolvedTheme === "dark"
                        ? "bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"
                        : "bg-gradient-to-r from-transparent via-gray-300/50 to-transparent"
                    }`}
                  />

                  <div className="relative">
                    <InfiniteMovingSkills
                      items={[...skillsBackend, ...skillsDevOps]}
                      direction="right"
                      speed="slow"
                      pauseOnHover={true}
                    />
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 mt-10 pt-6 border-t border-gray-500/10">
                    {[
                      { icon: Brain, label: "AI & ML", color: "purple" },
                      { icon: Layout, label: "Frontend", color: "amber" },
                      { icon: Server, label: "Backend", color: "emerald" },
                      { icon: Cloud, label: "DevOps", color: "rose" },
                    ].map(({ icon: Icon, label, color }) => (
                      <motion.div
                        key={label}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-default`}
                        style={{
                          backgroundColor:
                            resolvedTheme === "dark"
                              ? `rgba(168, 85, 247, 0.1)`
                              : `rgba(168, 85, 247, 0.1)`,
                        }}
                      >
                        <Icon
                          className="w-3.5 h-3.5"
                          style={{
                            color:
                              color === "purple"
                                ? resolvedTheme === "dark"
                                  ? "#c084fc"
                                  : "#9333ea"
                                : color === "amber"
                                  ? resolvedTheme === "dark"
                                    ? "#fbbf24"
                                    : "#d97706"
                                  : color === "emerald"
                                    ? resolvedTheme === "dark"
                                      ? "#34d399"
                                      : "#059669"
                                    : resolvedTheme === "dark"
                                      ? "#fb7185"
                                      : "#e11d48",
                          }}
                        />
                        <span
                          style={{
                            color:
                              color === "purple"
                                ? resolvedTheme === "dark"
                                  ? "#c084fc"
                                  : "#9333ea"
                                : color === "amber"
                                  ? resolvedTheme === "dark"
                                    ? "#fbbf24"
                                    : "#d97706"
                                  : color === "emerald"
                                    ? resolvedTheme === "dark"
                                      ? "#34d399"
                                      : "#059669"
                                    : resolvedTheme === "dark"
                                      ? "#fb7185"
                                      : "#e11d48",
                          }}
                        >
                          {label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Contact CTA Section */}
            <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
              <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`text-center p-8 sm:p-12 rounded-3xl backdrop-blur-md ${resolvedTheme === "dark" ? "bg-gray-800/40 border border-gray-700/30" : "bg-white/60 border border-gray-200/30"} shadow-2xl`}
                >
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`relative text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 inline-block w-full ${resolvedTheme === "dark" ? "animate-gradient-text-dark" : "animate-gradient-text-light"}`}
                  >
                    Ready to Work Together?
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto"
                  >
                    Let&apos;s discuss how I can help bring your ideas to life
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#daa520] via-[#f0c020] to-[#daa520] bg-[length:200%_100%] text-white hover:bg-right-bottom transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] rounded-full py-4 px-8 font-semibold border-2 border-[#daa520]/30 hover:border-[#daa520] hover:scale-105 text-lg"
                    >
                      <Mail className="h-5 w-5" />
                      Get in Touch
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </section>
          </main>

          {/* Resume Dialog */}
          <Dialog.Root open={isModalOpen} onOpenChange={closeModal}>
            <Dialog.Overlay className="fixed inset-0 bg-black/00 backdrop-blur-sm z-[9999]" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/50 rounded-xl shadow-2xl p-4 sm:p-6 w-[95vw] sm:w-[80vw] md:w-[70vw] h-[80vh] max-w-3xl max-h-[90vh] backdrop-blur-md z-[10000]">
              <Dialog.Title className="text-2xl font-bold mb-4 text-foreground text-center">
                My Resume
              </Dialog.Title>
              <button
                className="absolute top-3 right-3 text-[var(--foreground)]/60 hover:text-[var(--color-primary)] transition-colors rounded-full p-2 hover:bg-foreground/10"
                onClick={closeModal}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="w-full h-[calc(100%-8rem)] bg-gray-700/10 dark:bg-gray-800 rounded-lg shadow-inner overflow-hidden">
                <embed
                  src="/resume.pdf"
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  className="border-0"
                  title="Resume"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={closeModal}
                  variant="secondary"
                  className={`shadow-lg hover:text-[var(--color-primary)] transition-all duration-300 hover:scale-105 ${resolvedTheme === "dark" ? "text-[var(--foreground)] bg-gray-700/20" : "text-white bg-gray-700/20"}`}
                >
                  Close
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </motion.div>
    </>
  );
}
