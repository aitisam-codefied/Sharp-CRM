// app/layout.tsx
import type { Metadata } from "next";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "Sharp Management System - Hotel Accommodation Management",
  description:
    "Comprehensive hotel accommodation management system for asylum seekers across 30 UK branches",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Sharp CRM",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Sharp CRM" />
      </head>
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}