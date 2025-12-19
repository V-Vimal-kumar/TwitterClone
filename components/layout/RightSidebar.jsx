import SearchBox from "../right/SearchBox";
import WhatsHappening from "../right/WhatsHappening";

export default function RightSidebar() {
  return (
    <aside className="w-[350px] px-4">

      {/* TOP MASK — PREVENTS CONTENT BLEED */}
      <div className="sticky top-0 z-30 h-[12px] bg-[var(--bg)]" />

      {/* STICKY SEARCH BAR */}
      <div className="sticky top-[12px] z-30 bg-[var(--bg)] pb-3">
        <SearchBox />
      </div>

      {/* SCROLLING CONTENT */}
      <div className="mt-4">
        <WhatsHappening />
      </div>

    </aside>
  );
}
