"use client";

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { App } from "@capacitor/app";
import { Keyboard } from "@capacitor/keyboard";
import { Capacitor } from "@capacitor/core";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const p = Capacitor.getPlatform();
    const native = p === "ios" || p === "android";
    setIsNative(native);

    if (native) {
      // ✅ Only run on mobile builds
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: "#0f172a" });
      SplashScreen.hide();

      App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) window.history.back();
        else App.exitApp();
      });

      Keyboard.setScroll({ isDisabled: false });
    }

    return () => {
      if (native) {
        App.removeAllListeners();
      }
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${inter.className} ${isNative ? "has-bottom-nav" : ""}`}
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
            <Toaster />
            <MobileBottomNav />
            {/* ✅ always mounted, internally hides on web */}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
