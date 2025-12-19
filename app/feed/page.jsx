import LeftSidebar from "@/components/layout/LeftSidebar";
import IconSidebar from "@/components/layout/IconSidebar";
import FeedLayout from "@/components/layout/FeedLayout";
import RightSidebar from "@/components/layout/RightSidebar";
import MobileTopBar from "@/components/layout/MobileTopBar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">

      {/* MOBILE TOP BAR */}
      <MobileTopBar />

      {/* FIXED LEFT SIDEBAR (DESKTOP ONLY) */}
      <div className="hidden xl:block">
        <LeftSidebar />
      </div>

      {/* MAIN CONTENT AREA */}
<div className="mx-auto flex w-full max-w-[1350px] px-4 xl:px-0 xl:pl-[300px]">

        {/* ICON SIDEBAR — TABLET */}
        <IconSidebar />

        {/* FEED */}
        <div className="flex flex-1 justify-center">
          <FeedLayout />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block">
          <RightSidebar />
        </div>

      </div>

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav />
    </main>
  );
}
