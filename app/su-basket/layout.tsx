"use client";

import AuthGuard from "@/components/auth/auth-guard";

export default function BasketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
