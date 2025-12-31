"use client";

import { usePathname } from "next/navigation";

import LeftSidebar from "./LeftSidebar";
import IconSidebar from "./IconSidebar";
import RightSidebar from "./RightSidebar";
import MobileTopBar from "./MobileTopBar";
import MobileBottomNav from "./MobileBottomNav";

import { useConversations } from "@/hooks/useConversations";

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const isMessages = pathname.startsWith("/messages");

  const { conversations } = useConversations();

  // 🔥 GLOBAL UNREAD COUNT (DB = source of truth)
  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unread_count || 0),
    0
  );

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* ================= MOBILE TOP BAR ================= */}
      <MobileTopBar />

      {/* ================= LEFT SIDEBAR (DESKTOP XL+) ================= */}
      <div className="hidden xl:block">
        <LeftSidebar totalUnread={totalUnread} />
      </div>

      {/* ================= MAIN WRAPPER ================= */}
      <div
        className={`
          mx-auto flex w-full
          ${isMessages ? "max-w-none" : "max-w-[1350px] "}
          px-4 md:px-0
          xl:pl-[300px]
          pt-14 pb-16 md:pt-0 md:pb-0
        `}
      >
        {/* ================= ICON SIDEBAR (TABLET) ================= */}
        <div className="hidden md:flex xl:hidden">
          <IconSidebar totalUnread={totalUnread} />
        </div>

        {/* ================= CENTER CONTENT ================= */}
        <div className="flex flex-1">
          {children}
        </div>

        {/* ================= RIGHT SIDEBAR =================
            ❌ HIDDEN ON /messages
        */}
        {!isMessages && (
          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        )}
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <MobileBottomNav totalUnread={totalUnread} />
    </main>
  );
}
