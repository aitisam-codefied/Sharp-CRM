"use client";

import AuthGuard from "@/components/auth/auth-guard";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
