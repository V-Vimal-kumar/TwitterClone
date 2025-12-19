
import { Search } from "lucide-react";

export default function SearchBox() {
  return (
    <div className="relative mt-2">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2
                   text-[var(--muted)]"
      />

      <input
        placeholder="Search"
        className="w-full rounded-full
          bg-[var(--hover)]
          py-3 pl-12 pr-4
          text-[15px]
          text-[var(--text)]
          placeholder-[var(--muted)]
          outline-none
          focus:bg-[var(--bg)] focus:ring-1 focus:ring-[var(--blue)]"
      />
    </div>
  );
}
