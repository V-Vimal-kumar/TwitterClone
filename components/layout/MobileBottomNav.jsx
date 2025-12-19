"use client";

import { Home, Search, Bell, Sun, Moon, User } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export default function MobileBottomNav() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-14 bg-[var(--bg)] border-t border-[var(--border)] flex justify-around items-center md:hidden">
      <Home />
      <Search />
      <Bell />

      {/* THEME TOGGLE — SAFE */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-[var(--hover)]"
        aria-label="Toggle theme"
      >
        {mounted ? (
          isDark ? <Sun /> : <Moon />
        ) : (
          <div className="w-6 h-6" />
        )}
      </button>

      <User />
    </nav>
  );
}
