"use client";

import type React from "react";
import { AppNavbar } from "./app-navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({
  children,
  title,
  description,
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />

      <main className="flex-1">
        {(title || description || actions) && (
          <div className="bg-white border-b px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-gray-600 mt-1">{description}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-2">{actions}</div>
              )}
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="animate-slide-in">{children}</div>
        </div>
      </main>
    </div>
  );
}
