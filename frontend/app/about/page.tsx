"use client";

export const runtime = "edge";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import {
  ExternalLink,
  Calendar,
  BookOpen,
  Target,
  Cpu,
  Users,
  TrendingUp,
  Code2,
  Rocket,
  Heart,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface Certificate {
  _id: string;
  name: string;
  issuer: string;
  link: string;
  issue_date: string;
  image_url: string;
  slug: string;
  embedding: number[];
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Customizable story chapters - users can modify these
const storyChapters = [
  {
    title: "The Beginning",
    quote:
      "Every line of code tells a story. Mine began with a curiosity that couldn't be satisfied by textbooks alone.",
    content:
      "What started as tinkering with computers evolved into a passion for building solutions that matter. The journey from writing my first 'Hello World' to architecting complex systems taught me that technology is not just about code — it's about solving real problems for real people.",
    gradient: "from-purple-500/20 to-indigo-500/20",
  },
  {
    title: "The Evolution",
    quote:
      "Each project is a stepping stone, each challenge an opportunity to grow and innovate.",
    content:
      "Through countless projects and late nights debugging, I've learned that the best solutions come from understanding the problem deeply. Building tools that help others, automating tedious tasks, and creating experiences that delight users — these are the milestones that mark my journey.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "The Vision",
    quote:
      "Technology without purpose is just complexity. I believe in code that serves people.",
    content:
      "Looking forward, I see technology as a force multiplier for positive change. Whether it's building accessible applications, contributing to open source, or mentoring the next generation of developers — the goal remains the same: create meaningful impact through code.",
    gradient: "from-green-500/20 to-teal-500/20",
  },
];

// Customizable skills/focus areas
const focusAreas = [
  {
    title: "Full-Stack Development",
    description:
      "Building end-to-end solutions with modern frameworks and best practices for scalable, maintainable applications.",
    Icon: Code2,
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "AI & Machine Learning",
    description:
      "Leveraging artificial intelligence to create intelligent applications that learn and adapt.",
    Icon: Cpu,
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    title: "User Experience",
    description:
      "Designing intuitive interfaces that prioritize user needs and create delightful experiences.",
    Icon: Users,
    gradient: "from-green-500/20 to-teal-500/20",
  },
];

// Customizable driving forces/values
const drivingForces = [
  {
    title: "Continuous Learning",
    description:
      "A lifelong learner who believes that the day you stop learning is the day you stop growing. Every project is an opportunity to explore new territories.",
    Icon: BookOpen,
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Innovation",
    description:
      "Passionate about pushing boundaries and exploring new technologies to solve problems in creative ways.",
    Icon: Rocket,
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    title: "Impact Over Complexity",
    description:
      "The best solution is often the simplest one. Building technology that solves problems, not technology for technology's sake.",
    Icon: Target,
    gradient: "from-rose-500/20 to-pink-500/20",
  },
];

export default function AboutPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(true);
  const [errorFetchingCertificates, setErrorFetchingCertificates] =
    useState<Error | null>(null);
  const { theme } = useTheme();

  const heroRef = useRef<HTMLDivElement>(null);
  const certificationsRef = useRef<HTMLDivElement>(null);

  const [heroMousePosition, setHeroMousePosition] = useState({ x: 0, y: 0 });
  const [certificationsMousePosition, setCertificationsMousePosition] =
    useState({ x: 0, y: 0 });

  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const [isHoveringCertifications, setIsHoveringCertifications] =
    useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoadingCertificates(true);
      setErrorFetchingCertificates(null);
      try {
        const response = await apiClient.certificates.getAll();

        if (response.error || !Array.isArray(response.data)) {
          setCertificates([]);
          return;
        }

        const data = response.data as Certificate[];
        const sanitizedData = data.map((cert, index) => {
          let idString: string;

          if (cert._id && typeof cert._id === "object" && "$oid" in cert._id) {
            idString = (cert._id as unknown as { $oid: string }).$oid;
          } else if (typeof cert._id === "string") {
            idString = cert._id;
          } else if (cert.slug) {
            idString = cert.slug;
          } else {
            idString = `cert-${index}`;
          }

          return {
            ...cert,
            _id: idString,
          };
        });
        const sortedCertificates = [...sanitizedData].sort(
          (a, b) =>
            new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime(),
        );
        setCertificates(sortedCertificates);
      } catch (error) {
        setCertificates([]);
      } finally {
        setIsLoadingCertificates(false);
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (heroRef.current && isHoveringHero) {
        const rect = heroRef.current.getBoundingClientRect();
        setHeroMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
      if (certificationsRef.current && isHoveringCertifications) {
        const rect = certificationsRef.current.getBoundingClientRect();
        setCertificationsMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHoveringHero, isHoveringCertifications]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-background text-foreground">
      <div className="min-h-screen py-12 px-4 sm:px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto space-y-16"
        >
          {/* Hero Header Section */}
          <motion.section
            variants={itemVariants}
            className="text-center space-y-6"
            ref={heroRef}
            onMouseEnter={() => setIsHoveringHero(true)}
            onMouseLeave={() => setIsHoveringHero(false)}
          >
            <Card
              className={`bg-background/60 backdrop-blur-lg ${theme === "dark" ? "shadow-xl shadow-white/5" : "shadow-xl shadow-primary/20"} relative neon-border-hover overflow-hidden`}
              style={{
                // @ts-expect-error - CSS custom properties
                "--neon-gradient": isHoveringHero
                  ? `radial-gradient(circle 200px at ${heroMousePosition.x}px ${heroMousePosition.y}px, rgba(14, 165, 233, 0.6), transparent 100%)`
                  : "transparent",
              }}
            >
              <CardContent className="p-8 sm:p-12">
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-text bg-[length:200%_auto]"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {siteConfig.ownerName}
                </motion.h1>
                <motion.p
                  className="text-xl sm:text-2xl text-muted-foreground font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {siteConfig.ownerTitle}
                </motion.p>
              </CardContent>
            </Card>
          </motion.section>

          {/* My Story Section */}
          <motion.section variants={itemVariants} className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              My Story
            </h2>
            <div className="relative">
              {/* Timeline connector */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 hidden md:block" />

              <div className="space-y-12">
                {storyChapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className={`relative ${index % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]"}`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block" />

                    <Card
                      className={`bg-gradient-to-br ${chapter.gradient} backdrop-blur-md border border-purple-500/20 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)]`}
                    >
                      <CardContent className="p-6 sm:p-8">
                        <h3 className="text-2xl font-bold mb-4 text-primary">
                          {chapter.title}
                        </h3>
                        <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4 mb-4">
                          &ldquo;{chapter.quote}&rdquo;
                        </blockquote>
                        <p className="text-foreground/80 leading-relaxed">
                          {chapter.content}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Focus Areas Section */}
          <motion.section variants={itemVariants} className="space-y-8">
            <Card
              className={`bg-background/60 backdrop-blur-lg border-none ${theme === "dark" ? "shadow-xl shadow-white/5" : "shadow-xl shadow-primary/20"}`}
            >
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  Focus Areas
                </h2>
                <motion.p
                  className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {siteConfig.ownerBio}
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {focusAreas.map((area, index) => (
                    <motion.div
                      key={area.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className={`h-full p-6 rounded-2xl backdrop-blur-md backdrop-saturate-150 bg-gradient-to-br ${area.gradient} border border-purple-500/20 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)] group`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                            <area.Icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground/90 group-hover:text-purple-500 transition-colors">
                            {area.title}
                          </h3>
                        </div>
                        <p className="text-sm text-foreground/60 leading-relaxed">
                          {area.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Professional Certifications Section */}
          {certificates.length > 0 && (
            <motion.section
              variants={itemVariants}
              className="space-y-6"
              ref={certificationsRef}
              onMouseEnter={() => setIsHoveringCertifications(true)}
              onMouseLeave={() => setIsHoveringCertifications(false)}
            >
              <Card
                className={`bg-background/60 backdrop-blur-lg ${theme === "dark" ? "shadow-xl shadow-white/5" : "shadow-xl shadow-primary/20"} relative neon-border-hover`}
                style={{
                  // @ts-expect-error - CSS custom properties
                  "--neon-gradient": isHoveringCertifications
                    ? `radial-gradient(circle 200px at ${certificationsMousePosition.x}px ${certificationsMousePosition.y}px, rgba(14, 165, 233, 0.6), transparent 100%)`
                    : "transparent",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Professional Certifications
                  </h2>
                  {isLoadingCertificates ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <motion.div
                      key="certificates-grid"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {certificates.map((cert, index) => (
                        <Dialog
                          key={
                            cert._id?.toString() || cert.slug || `cert-${index}`
                          }
                        >
                          <DialogTrigger asChild>
                            <motion.div
                              whileHover={{
                                scale: 1.02,
                                boxShadow:
                                  "0 8px 32px rgba(124, 58, 237, 0.15)",
                              }}
                              className="group relative cursor-pointer rounded-2xl p-6
                                bg-gradient-to-br from-purple-500/10 to-purple-600/5
                                backdrop-blur-md backdrop-saturate-150
                                border border-purple-500/20 transition-all duration-300
                                hover:border-purple-500/40"
                            >
                              {cert.image_url && (
                                <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
                                  <Image
                                    src={cert.image_url}
                                    alt={cert.name}
                                    width={400}
                                    height={225}
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              )}
                              <h3 className="text-lg font-semibold mb-2 text-foreground/90 group-hover:text-purple-500 transition-colors">
                                {cert.name}
                              </h3>
                              <p className="text-sm text-foreground/60 mb-4">
                                {cert.issuer}
                              </p>
                              <div className="flex items-center text-sm text-foreground/60">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(cert.issue_date).toLocaleDateString()}
                              </div>
                            </motion.div>
                          </DialogTrigger>
                          <DialogContent
                            className={`${theme === "dark" ? "bg-[var(--color-blue)]/30" : "bg-[var(--color-blue)]/30"}`}
                          >
                            <DialogHeader>
                              <DialogTitle className="text-sm sm:text-xl font-bold text-primary">
                                {cert.name}
                              </DialogTitle>
                              <DialogDescription className="text-sm sm:text-lg text-foreground/80">
                                Issued by {cert.issuer} on{" "}
                                {new Date(cert.issue_date).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>
                            {cert.image_url && (
                              <div>
                                <Image
                                  src={cert.image_url}
                                  alt={cert.name}
                                  width={800}
                                  height={450}
                                  className="rounded-lg"
                                />
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                asChild
                                className="bg-gradient-to-r from-[#daa520] via-[#f0c020] to-[#daa520] bg-[length:200%_100%] text-white hover:bg-right-bottom transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] rounded-full font-semibold border-2 border-[#daa520]/30 hover:border-[#daa520] hover:scale-105"
                              >
                                <Link
                                  href={cert.link}
                                  target="_blank"
                                  className="flex items-center cursor-pointer"
                                >
                                  View Certificate{" "}
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </Link>
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* What Drives Me Section */}
          <motion.section variants={itemVariants} className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              What Drives Me
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {drivingForces.map((force, index) => (
                <motion.div
                  key={force.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full bg-gradient-to-br ${force.gradient} backdrop-blur-md border border-purple-500/20 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)] group`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                          <force.Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground/90 group-hover:text-purple-500 transition-colors">
                          {force.title}
                        </h3>
                      </div>
                      <p className="text-sm text-foreground/60 leading-relaxed">
                        {force.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
