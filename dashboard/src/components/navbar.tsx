"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { LogOut, User } from "lucide-react";
import { clearAuth, getEmail } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const email = getEmail();

  const handleSignOut = () => {
    clearAuth();
    router.push("/sign-in");
  };

  return (
    <div className="flex items-center p-4">
      <div className="flex w-full justify-end items-center space-x-4">
        {/* Admin Email Display */}
        {email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>{email}</span>
          </div>
        )}

        <ModeToggle />

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
