"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const containerRef = useRef(null);

  // 🔹 Fetch users (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search/users?q=${query}`, {
          credentials: "include",
        });
        const data = await res.json();
        setUsers(data || []);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 🔹 Close search on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setQuery("");
        setUsers([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative mt-2">
      {/* Search input */}
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
      />

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search"
        className="
          w-full rounded-full bg-[var(--hover)]
          py-3 pl-12 pr-4 text-[15px]
          text-[var(--text)] placeholder-[var(--muted)]
          outline-none
          focus:bg-[var(--bg)]
          focus:ring-1 focus:ring-[var(--blue)]
        "
      />

      {/* Results */}
      {query && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] shadow-lg z-50 overflow-hidden">

          {loading && (
            <div className="px-4 py-3 text-sm text-[var(--muted)]">
              Searching…
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="px-4 py-3 text-sm text-[var(--muted)]">
              No users found
            </div>
          )}

          {users.map(user => (
            <button
              key={user.id}
              onClick={() => {
                setQuery("");
                setUsers([]);
                router.push(`/profile/${user.username}`);
              }}
              className="
                w-full flex items-center gap-3 px-4 py-3
                hover:bg-[var(--hover)] text-left
              "
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--border)]">
                {user.avatar_url && (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* User info */}
              <div className="min-w-0">
                <div className="font-semibold truncate">
                  {user.name}
                </div>
                <div className="text-sm text-[var(--muted)] truncate">
                  @{user.username}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
