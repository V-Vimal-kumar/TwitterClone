"use client";

import { Home, Search, Bell, User, Sun, Moon } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export default function IconSidebar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside className="hidden md:flex xl:hidden w-[72px] flex-col items-center py-4 border-r border-[var(--border)]">

      <div className="mb-6 text-xl font-bold">X</div>

      <nav className="space-y-6 flex flex-col items-center">
        <Home size={24} />
        <Search size={24} />
        <Bell size={24} />
        <User size={24} />

        {/* THEME TOGGLE — SAFE */}
        <button
          onClick={toggleTheme}
          className="mt-6 p-3 rounded-full hover:bg-[var(--hover)]"
        >
          {mounted ? (
            isDark ? <Sun size={22} /> : <Moon size={22} />
          ) : (
            <div className="w-[22px] h-[22px]" /> // placeholder
          )}
        </button>
      </nav>

    </aside>
  );
}
