"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { useEffect, useMemo, useState } from "react";
import { mainNavItems, subNavItemsMap, getCurrentSection } from "./nav-config";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const p = Capacitor.getPlatform();
    setIsNative(p === "ios" || p === "android");
  }, []);

  const currentSection = useMemo(
    () => getCurrentSection(pathname || ""),
    [pathname]
  );
  const subNavItems = subNavItemsMap[currentSection] || [];

  if (!isNative) return null;

  return (
    <>
      {/* Contextual sub-nav row (chips) */}
      {subNavItems.length > 0 && (
        <div
          className="fixed bottom-14 left-0 right-0 bg-gray-50 border-t z-50"
          style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
        >
          <div className="flex gap-2 overflow-x-auto px-3 py-2 no-scrollbar">
            {subNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? `${item.color} shadow-sm`
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-[60]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5 sm:grid-cols-7 h-14">
          {mainNavItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex flex-col items-center justify-center text-[11px]"
              >
                <item.icon
                  className={`h-5 w-5 mb-0.5 ${
                    isActive ? "text-red-600" : "text-gray-400"
                  }`}
                />
                <span className={isActive ? "text-red-600" : "text-gray-500"}>
                  {item.title.replace("Management", "") /* shorter labels */}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
