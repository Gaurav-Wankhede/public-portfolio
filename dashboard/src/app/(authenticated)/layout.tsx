"use client";

import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="h-full relative">
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
          <Sidebar />
        </div>
        <main className="md:pl-72 pb-10">
          <Navbar />
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
