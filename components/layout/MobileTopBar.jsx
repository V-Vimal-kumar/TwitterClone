export default function MobileTopBar() {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[var(--bg)] border-b border-[var(--border)] flex items-center justify-between px-4 lg:hidden">
        <span className="font-bold text-lg">X</span>
        <div className="w-8 h-8 rounded-full bg-[var(--border)]" />
      </header>
    );
  }
  