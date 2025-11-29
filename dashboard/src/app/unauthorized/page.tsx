"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto logout and redirect after 3 seconds
    const timer = setTimeout(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/sign-in");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/sign-in");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="p-6 bg-white dark:bg-gray-800 border-2 border-red-500 dark:border-red-600 rounded-xl shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You are not authorized to access this admin dashboard.
                <br />
                <br />
                Only the designated admin account has access privileges. Your
                Google account email must match the configured admin email in
                the system.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You will be signed out automatically in 3 seconds...
          </p>

          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium"
          >
            Sign Out Now
          </button>
        </div>
      </div>
    </div>
  );
}
