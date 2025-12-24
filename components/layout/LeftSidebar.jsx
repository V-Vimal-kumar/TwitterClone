"use client";

import {
  Home,
  Search,
  Bell,
  User,
  MoreHorizontal,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useTheme from "@/hooks/useTheme";
import TweetComposer from "../tweet/TweetComposer";

const items = [
  { label: "Home", icon: Home, path: "/feed" },
  { label: "Explore", icon: Search, path: "/explore" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Profile", icon: User, path: "/profile" },
];

export default function LeftSidebar() {
  const { toggleTheme } = useTheme();
  const pathname = usePathname();

  const [showMore, setShowMore] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [user, setUser] = useState(null);

  const moreRef = useRef(null);

  // close "More" on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  };

  useEffect(() => {
  fetch("/api/users/me", { credentials: "include" })
    .then(res => res.ok ? res.json() : null)
    .then(data => setUser(data))
    .catch(() => {});
}, []);


  return (
    <>
      <aside className="fixed top-0 left-0 z-30 h-screen w-[300px] bg-[var(--bg)] hidden lg:block">
        <div className="pl-[72px] pr-6">
          <nav className="mt-8 space-y-1">

            {/* MAIN NAV */}
            {items.map(({ label, icon: Icon, path }) => {
              const isActive = pathname === path;

              return (
                <Link
                  key={label}
                  href={path}
                  className={`flex items-center gap-4 px-5 py-[14px] rounded-full
                    hover:bg-[var(--hover)]
                    ${isActive ? "font-bold" : "font-medium"}
                  `}
                >
                  <Icon size={26} strokeWidth={isActive ? 2.5 : 2.2} />
                  <span className="text-xl">{label}</span>
                </Link>
              );
            })}

            {/* THEME TOGGLE */}
            <div
              onClick={toggleTheme}
              className="flex items-center gap-4 px-5 py-[14px] rounded-full cursor-pointer hover:bg-[var(--hover)] mt-2"
            >
              <Sun size={24} className="hidden dark:block" />
              <Moon size={24} className="block dark:hidden" />
              <span className="text-xl font-medium">
                <span className="hidden dark:inline">Light mode</span>
                <span className="inline dark:hidden">Dark mode</span>
              </span>
            </div>

            {/* MORE */}
            <div ref={moreRef} className="relative">
              <div
                onClick={() => setShowMore(v => !v)}
                className="flex items-center gap-4 px-5 py-[14px] rounded-full cursor-pointer hover:bg-[var(--hover)] font-medium"
              >
                <MoreHorizontal size={26} />
                <span className="text-xl">More</span>
              </div>

              {showMore && (
                <div
                  className="absolute left-5 bottom-14 w-[220px] rounded-xl border border-[var(--border)] bg-[var(--bg)] shadow-xl overflow-hidden z-50"
                >
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-[var(--hover)]"
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </div>
              )}
            </div>

          </nav>

          {/* POST BUTTON → FLOATING */}
          <button
            onClick={() => setShowPost(true)}
            className="mt-8 w-[90%] py-3 rounded-full font-bold text-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Post
          </button>
        </div>
      </aside>

      {/* FLOATING POST MODAL */}
      {showPost && (
  <div className="fixed inset-0 z-50 flex justify-center items-start pt-20">
    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setShowPost(false)}
    />

    {/* MODAL */}
    <div className="relative w-full max-w-xl bg-[var(--bg)] rounded-2xl shadow-xl z-10">
      <TweetComposer
        user={user}
        onPostCreated={(post) => {
          if (post?.id && post?.author) {
            // optional: emit event or update global feed
          }
          setShowPost(false);
        }}
      />
    </div>
  </div>
)}
    </>
  );
}
