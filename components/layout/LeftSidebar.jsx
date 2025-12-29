"use client";

import {
  Home,
  Search,
  User,
  Sun,
  Moon,
  LogOut,
  Mail
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useTheme from "@/hooks/useTheme";
import TweetComposer from "../tweet/TweetComposer";
import MobileSearchOverlay from "@/components/layout/MobileSearchOverlay";
import ConfirmLogoutModal from "@/components/common/ConfirmLogoutModal";
import { useUnread } from "@/context/UnreadContext";

export default function LeftSidebar() {
  const { toggleTheme, theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [showSearch, setShowSearch] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [user, setUser] = useState(null);
const { total } = useUnread();

  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(setUser)
      .catch(() => { });
  }, []);

  return (
    <>
      <aside className="fixed top-0 left-0 z-30 h-screen w-[300px] bg-[var(--bg)] hidden lg:block">
        <div className="pl-[72px] pr-6">
          <nav className="mt-8 space-y-1">

            {/* HOME */}
            <button
              onClick={() => router.push("/feed")}
              className={`flex items-center gap-4 px-5 py-[14px] rounded-full hover:bg-[var(--hover)]
                ${pathname === "/feed" ? "font-bold" : "font-medium"}
              `}
            >
              <Home size={26} />
              <span className="text-xl">Home</span>
            </button>

            {/* SEARCH / EXPLORE */}
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-4 px-5 py-[14px] rounded-full hover:bg-[var(--hover)] font-medium"
            >
              <Search size={26} />
              <span className="text-xl">Explore</span>
            </button>

            {/* MESSAGES */}
            <button
              onClick={() => router.push("/messages")}
              className={`flex items-center gap-4 px-5 py-[14px] rounded-full hover:bg-[var(--hover)]
  ${pathname === "/messages" ? "font-bold" : "font-medium"}`}
            >
              {/* ICON + BADGE */}
              <div className="relative">
                <Mail size={26} />
                {total > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[11px] px-1.5 rounded-full min-w-[18px] text-center">
                    {total}
                  </span>
                )}
              </div>

              <span className="text-xl">Messages</span>
            </button>

            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-4 px-5 py-[14px] rounded-full hover:bg-[var(--hover)] font-medium"
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
              <span className="text-xl">
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </button>

            {/* LOGOUT */}
            <button
              onClick={() => setShowLogout(true)}
              className="flex items-center gap-4 px-5 py-[14px] rounded-full hover:bg-[var(--hover)] font-medium hover:bg-[var(--hover)"
            >
              <LogOut size={26} />
              <span className="text-xl">Log out</span>
            </button>

            {/* PROFILE */}
            <button
              onClick={() => router.push("/profile")}
              className={`flex items-center gap-4 px-5 py-[14px] rounded-full hover:bg-[var(--hover)]
                ${pathname === "/profile" ? "font-bold" : "font-medium"}
              `}
            >
              <User size={26} />
              <span className="text-xl">Profile</span>
            </button>

          </nav>

          {/* POST BUTTON */}
          <button
            onClick={() => setShowPost(true)}
            className="mt-8 w-[90%] py-3 rounded-full font-bold text-lg
              bg-black text-white hover:bg-gray-800
              dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Post
          </button>
        </div>
      </aside>

      {/* SEARCH OVERLAY (outside click closes automatically) */}
      <MobileSearchOverlay
        open={showSearch}
        onClose={() => setShowSearch(false)}
      />

      {/* LOGOUT CONFIRM */}
      <ConfirmLogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={() => {
          fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          }).finally(() => {
            window.location.href = "/login";
          });
        }}
      />

      {/* POST MODAL */}
      {showPost && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPost(false)}
          />
          <div className="relative w-full max-w-xl bg-[var(--bg)] rounded-2xl shadow-xl z-10">
            <TweetComposer
              user={user}
              onPostCreated={() => setShowPost(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
