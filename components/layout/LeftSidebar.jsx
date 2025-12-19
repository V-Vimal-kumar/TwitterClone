"use client";

import {
  Home,
  Search,
  Bell,
  User,
  MoreHorizontal,
  Sun,
  Moon,
} from "lucide-react";
import useTheme from "@/hooks/useTheme";

const items = [
  { label: "Home", icon: Home, active: true },
  { label: "Explore", icon: Search },
  { label: "Notifications", icon: Bell },
  { label: "Profile", icon: User },
  { label: "More", icon: MoreHorizontal },
];

export default function LeftSidebar() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-[300px] bg-[var(--bg)] hidden lg:block">
      {/* INNER OFFSET */}
      <div className="pl-[72px] pr-6">
        <nav className="mt-8 space-y-1">
          {items.map(({ label, icon: Icon, active }) => (
            <div
              key={label}
              className={`flex items-center gap-4 px-5 py-[14px] rounded-full cursor-pointer
                hover:bg-[var(--hover)]
                ${active ? "font-bold" : "font-medium"}
              `}
            >
              <Icon size={26} strokeWidth={active ? 2.5 : 2.2} />
              <span className="text-xl">{label}</span>
            </div>
          ))}

          {/* THEME TOGGLE — ALWAYS RENDERED */}
          <div
            onClick={toggleTheme}
            className="flex items-center gap-4 px-5 py-[14px] rounded-full cursor-pointer hover:bg-[var(--hover)] mt-2"
          >
            {/* Icons: CSS controls visibility */}
            <Sun size={24} className="hidden dark:block" />
            <Moon size={24} className="block dark:hidden" />

            {/* Text: also CSS-based */}
            <span className="text-xl font-medium">
              <span className="hidden dark:inline">Light mode</span>
              <span className="inline dark:hidden">Dark mode</span>
            </span>
          </div>

        </nav>

        {/* POST BUTTON — ALWAYS RENDERED */}
        <button className="mt-8 w-[90%] py-3 rounded-full font-bold text-lg transition-colors bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 ">
          Post
        </button>

      </div>
    </aside>
  );
}
