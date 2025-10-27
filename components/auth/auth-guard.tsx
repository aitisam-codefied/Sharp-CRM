"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // ✅ 1. If user is not logged in, send to /login
    if (!user) {
      router.replace("/login");
      return;
    }

    // ✅ 2. If user is onboarded, block onboarding route
    if (user.isOnboarded && pathname.startsWith("/on-boarding")) {
      router.replace("/dashboard"); // or wherever you want to send them
      return;
    }

    // ✅ 3. If user is NOT onboarded, block other routes until they complete onboarding
    if (!user.isOnboarded && !pathname.startsWith("/on-boarding")) {
      router.replace("/on-boarding");
      return;
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
