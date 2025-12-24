"use client";

import { Home, Search, Sun, Moon, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useTheme from "@/hooks/useTheme";
import MobileSearchOverlay from "@/components/layout/MobileSearchOverlay";
import ConfirmLogoutModal from "@/components/common/ConfirmLogoutModal";

export default function MobileBottomNav() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  const isDark = theme === "dark";

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-14 bg-[var(--bg)] border-t border-[var(--border)] flex justify-around items-center md:hidden">

        <button onClick={() => router.push("/feed")}>
          <Home />
        </button>

        <button onClick={() => setShowSearch(true)}>
          <Search />
        </button>

        <button onClick={toggleTheme}>
          {mounted ? isDark ? <Sun /> : <Moon /> : <div className="w-6 h-6" />}
        </button>

        <button onClick={() => setShowLogout(true)}>
          <LogOut />
        </button>

        <button onClick={() => router.push("/profile")}>
          <User />
        </button>
      </nav>

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
