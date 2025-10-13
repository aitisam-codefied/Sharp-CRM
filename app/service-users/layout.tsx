"use client";

import AuthGuard from "@/components/auth/auth-guard";

export default function ServiceUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
