"use client";

import { Home, Search, Sun, Moon, User, LogOut, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useTheme from "@/hooks/useTheme";
import MobileSearchOverlay from "@/components/layout/MobileSearchOverlay";
import ConfirmLogoutModal from "@/components/common/ConfirmLogoutModal";
import { useUnread } from "@/context/UnreadContext";

export default function IconSidebar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();
  const { total } = useUnread();

  const isDark = theme === "dark";

  return (
    <>
      <aside className="hidden md:flex xl:hidden w-[72px] flex-col items-center py-4 border-r border-[var(--border)] bg-[var(--bg)]">

        <div
          className="mb-6 text-xl font-bold cursor-pointer"
          onClick={() => router.push("/feed")}
        >
          X
        </div>

        <nav className="space-y-6 flex flex-col items-center">

          <button onClick={() => router.push("/feed")}>
            <Home />
          </button>

          <button onClick={() => setShowSearch(true)}>
            <Search />
          </button>

          <button onClick={() => router.push("/messages")}>
            <div className="relative">
              <Mail />
              {total > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {total}
                </span>
              )}
            </div>
          </button>

          <button onClick={toggleTheme}>
            {mounted ? isDark ? <Sun /> : <Moon /> : <div className="w-5 h-5" />}
          </button>

          <button onClick={() => setShowLogout(true)}>
            <LogOut />
          </button>

          <button onClick={() => router.push("/profile")}>
            <User />
          </button>
        </nav>
      </aside>

      <MobileSearchOverlay
        open={showSearch}
        onClose={() => setShowSearch(false)}
      />

      <ConfirmLogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={() => {
          localStorage.clear();
          router.push("/login");
        }}
      />
    </>
  );
}
