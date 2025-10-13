"use client";

import AuthGuard from "@/components/auth/auth-guard";

export default function ClockSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
