"use client";

import AuthGuard from "@/components/auth/auth-guard";

export default function IncidentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
