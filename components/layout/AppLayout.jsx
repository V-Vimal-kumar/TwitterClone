"use client";

import LeftSidebar from "./LeftSidebar";
import IconSidebar from "./IconSidebar";
import RightSidebar from "./RightSidebar";
import MobileTopBar from "./MobileTopBar";
import MobileBottomNav from "./MobileBottomNav";

export default function AppLayout({ children }) {
  return (
    <main className="min-h-screen bg-[var(--bg)] ">

      <MobileTopBar />

      {/* LEFT SIDEBAR (DESKTOP) */}
      <div className="hidden xl:block">
        <LeftSidebar />
      </div>

      <div className="mx-auto flex w-full max-w-[1350px] px-4 xl:px-0 xl:pl-[300px]">

        {/* ICON SIDEBAR (TABLET) */}
        <IconSidebar />

        {/* CENTER CONTENT */}
        <div className="flex flex-1 justify-center">
          {children}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block">
          <RightSidebar />
        </div>

      </div>

      <MobileBottomNav />
    </main>
  );
}
