"use client";

export const runtime = "edge";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useTheme } from "next-themes";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Github,
  Twitter,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContactPage() {
  const { resolvedTheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const isDark = resolvedTheme === "dark";

  // Build contact info from siteConfig
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: siteConfig.contactEmail,
      href: `mailto:${siteConfig.contactEmail}`,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    ...(siteConfig.contactLocation
      ? [
          {
            icon: MapPin,
            label: "Location",
            value: siteConfig.contactLocation,
            href: null as string | null,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
          },
        ]
      : []),
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 hours",
      href: null as string | null,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  // Build social links from siteConfig (only show configured ones)
  const socialLinks = [
    ...(siteConfig.socialLinks.linkedin
      ? [
          {
            icon: Linkedin,
            href: siteConfig.socialLinks.linkedin,
            label: "LinkedIn",
            color: "hover:text-blue-500",
          },
        ]
      : []),
    ...(siteConfig.socialLinks.github
      ? [
          {
            icon: Github,
            href: siteConfig.socialLinks.github,
            label: "GitHub",
            color: "hover:text-purple-500",
          },
        ]
      : []),
    ...(siteConfig.socialLinks.twitter
      ? [
          {
            icon: Twitter,
            href: siteConfig.socialLinks.twitter,
            label: "Twitter",
            color: "hover:text-sky-500",
          },
        ]
      : []),
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
          reply_to: data.email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      );

      if (result.status === 200) {
        setSubmitStatus("success");
        reset();
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      console.error("Email error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Let&apos;s Connect
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className={isDark ? "text-white" : "text-gray-900"}>
              Get in{" "}
            </span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p
            className={cn(
              "text-lg max-w-2xl mx-auto",
              isDark ? "text-gray-400" : "text-gray-600",
            )}
          >
            Have a project in mind or want to collaborate? I&apos;d love to hear
            from you. Drop me a message and I&apos;ll get back to you as soon as
            possible.
          </p>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Side - Contact Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={cn(
                    "group p-5 rounded-2xl border transition-all duration-300",
                    isDark
                      ? "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg",
                  )}
                >
                  {info.href ? (
                    <a href={info.href} className="flex items-start gap-4">
                      <div className={cn("p-3 rounded-xl", info.bgColor)}>
                        <info.icon className={cn("w-5 h-5", info.color)} />
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-sm font-medium mb-1",
                            isDark ? "text-gray-400" : "text-gray-500",
                          )}
                        >
                          {info.label}
                        </p>
                        <p
                          className={cn(
                            "font-semibold group-hover:text-amber-500 transition-colors",
                            isDark ? "text-white" : "text-gray-900",
                          )}
                        >
                          {info.value}
                        </p>
                      </div>
                      <ArrowRight
                        className={cn(
                          "w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all",
                          isDark ? "text-gray-400" : "text-gray-500",
                        )}
                      />
                    </a>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className={cn("p-3 rounded-xl", info.bgColor)}>
                        <info.icon className={cn("w-5 h-5", info.color)} />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-medium mb-1",
                            isDark ? "text-gray-400" : "text-gray-500",
                          )}
                        >
                          {info.label}
                        </p>
                        <p
                          className={cn(
                            "font-semibold",
                            isDark ? "text-white" : "text-gray-900",
                          )}
                        >
                          {info.value}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={cn(
                  "p-6 rounded-2xl border",
                  isDark
                    ? "bg-gray-900/50 border-gray-800"
                    : "bg-white border-gray-200",
                )}
              >
                <h3
                  className={cn(
                    "text-lg font-semibold mb-4",
                    isDark ? "text-white" : "text-gray-900",
                  )}
                >
                  Connect on Social
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "p-3 rounded-xl transition-colors",
                        isDark
                          ? "bg-gray-800 text-gray-400"
                          : "bg-gray-100 text-gray-600",
                        social.color,
                      )}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={cn(
                "p-6 rounded-2xl border-2 border-dashed",
                isDark ? "border-gray-700" : "border-gray-300",
              )}
            >
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                💡 <strong>Pro Tip:</strong> Include details about your project
                timeline, budget range, and specific goals for a faster
                response!
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div
              className={cn(
                "p-8 sm:p-10 rounded-3xl border",
                isDark
                  ? "bg-gray-900/50 border-gray-800"
                  : "bg-white border-gray-200 shadow-xl",
              )}
            >
              <h2
                className={cn(
                  "text-2xl font-bold mb-2",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Send a Message
              </h2>
              <p
                className={cn(
                  "text-sm mb-8",
                  isDark ? "text-gray-400" : "text-gray-500",
                )}
              >
                Fill out the form below and I&apos;ll get back to you within 24
                hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-medium mb-2",
                        isDark ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      Your Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="John Doe"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300",
                        "focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                        isDark
                          ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400",
                        errors.name &&
                          "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                      )}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={cn(
                        "block text-sm font-medium mb-2",
                        isDark ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      Email Address
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="john@example.com"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300",
                        "focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                        isDark
                          ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400",
                        errors.email &&
                          "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                      )}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-2",
                      isDark ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    Subject
                  </label>
                  <input
                    {...register("subject")}
                    type="text"
                    placeholder="Project Inquiry / Collaboration / General Question"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300",
                      "focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                      isDark
                        ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400",
                      errors.subject &&
                        "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                    )}
                  />
                  {errors.subject && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-2",
                      isDark ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    Your Message
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="Tell me about your project, ideas, or just say hello..."
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 resize-none",
                      "focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                      isDark
                        ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400",
                      errors.message &&
                        "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                    )}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full py-4 rounded-xl font-semibold text-white transition-all duration-300",
                    "bg-gradient-to-r from-amber-500 to-orange-500",
                    "hover:from-amber-600 hover:to-orange-600",
                    "focus:outline-none focus:ring-2 focus:ring-amber-500/50",
                    "disabled:opacity-70 disabled:cursor-not-allowed",
                    "flex items-center justify-center gap-2",
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <motion.span
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm text-emerald-500">
                      Message sent successfully! I&apos;ll get back to you soon.
                    </p>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-500">
                      Failed to send message. Please try again or email me
                      directly.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
