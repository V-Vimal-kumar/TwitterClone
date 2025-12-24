"use client";

import { useEffect, useRef, useState } from "react";

export default function CommentComposer({ postId, onAdd }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);
  const inputRef = useRef(null);

  // 🔹 Fetch current user
  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(setMe)
      .catch(() => {});
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: text }),
    });

    const comment = await res.json();
    onAdd(comment);

    setText("");
    setLoading(false);
  };

  return (
    <div className="flex gap-3 py-3">
      {/* 👤 Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--border)]">
        {me?.avatar_url && (
          <img
            src={me.avatar_url}
            alt={me.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1">
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Post your reply"
          rows={2}
          className="w-full resize-none bg-transparent outline-none text-sm text-[var(--text)] placeholder-[var(--muted)]"
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={submit}
            disabled={!text.trim() || loading}
            className="px-4 py-1.5 rounded-full bg-[#1D9BF0] text-white text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Replying…" : "Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
