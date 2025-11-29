"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Award,
  BookOpen,
  Tag,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Stats {
  projects: number;
  certificates: number;
  blogPosts: number;
  categories: number;
}

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel using Next.js API proxy routes
        const [projectsRes, certsRes, postsRes, categoriesRes] =
          await Promise.all([
            fetch(`/api/projects`),
            fetch(`/api/certificates`),
            fetch(`/api/blog/posts`),
            fetch(`/api/blog/categories`),
          ]);

        // Parse JSON safely with fallback to empty array
        const parseJson = async (response: Response) => {
          try {
            if (!response.ok) {
              console.warn(
                `API call failed: ${response.url} - ${response.status}`,
              );
              return [];
            }
            const text = await response.text();
            if (!text || text.trim() === "") {
              console.warn(`Empty response from: ${response.url}`);
              return [];
            }
            return JSON.parse(text);
          } catch (error) {
            console.error(`Failed to parse JSON from ${response.url}:`, error);
            return [];
          }
        };

        const [projects, certificates, posts, categories] = await Promise.all([
          parseJson(projectsRes),
          parseJson(certsRes),
          parseJson(postsRes),
          parseJson(categoriesRes),
        ]);

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          certificates: Array.isArray(certificates) ? certificates.length : 0,
          blogPosts: Array.isArray(posts) ? posts.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total Projects",
      value: stats?.projects.toString() ?? "0",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Certificates",
      value: stats?.certificates.toString() ?? "0",
      icon: Award,
      color: "bg-green-500",
    },
    {
      title: "Blog Posts",
      value: stats?.blogPosts.toString() ?? "0",
      icon: BookOpen,
      color: "bg-purple-500",
    },
    {
      title: "Categories",
      value: stats?.categories.toString() ?? "0",
      icon: Tag,
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      title: "New Blog Post",
      description: "Create a new blog post with rich content",
      icon: BookOpen,
      href: "/dashboard/blog/new",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Manage Categories",
      description: "Organize content with categories",
      icon: Tag,
      href: "/dashboard/categories",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "View Projects",
      description: "Manage your portfolio projects",
      icon: FileText,
      href: "/projects",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Certificates",
      description: "Manage professional certificates",
      icon: Award,
      href: "/certificates",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Affiliate Products",
      description: "Track affiliate products and earnings",
      icon: DollarSign,
      href: "/dashboard/affiliate",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Analytics",
      description: "View affiliate performance metrics",
      icon: TrendingUp,
      href: "/dashboard/affiliate/analytics",
      color: "from-pink-500 to-pink-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl mx-auto mt-12">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here&apos;s what&apos;s happening with your portfolio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quick Actions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your content and portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => router.push(action.href)}
                className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700 text-left overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                />

                <div className="relative">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${action.color} mb-4`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {action.description}
                  </p>

                  <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    <span>Open</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Info */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Content summary</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Projects
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats?.projects || 0}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Certificates
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats?.certificates || 0}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Blog Posts
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats?.blogPosts || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Categories
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats?.categories || 0}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard/blog")}
              className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Manage Content
            </button>
          </div>

          {/* Quick Info */}
          <div className="mt-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 shadow-sm text-white">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Status</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Backend</span>
                <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Database</span>
                <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Auth</span>
                <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded">
                  Enabled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
