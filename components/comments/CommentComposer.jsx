"use client";

import { useEffect, useRef, useState } from "react";

export default function CommentComposer({
  postId,
  parentCommentId = null,
  replyToUser = null,
  onAdd,
  onCancel,
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

const submit = async () => {
  if (!text.trim() || loading) return;

  setLoading(true);

  const payload = {
    postId,
    content: text,
    parentCommentId,
    replyToUserId: replyToUser?.id ?? null,
  };

  if (replyToUser) {
    payload.content = `@${replyToUser.username} ${text}`;
  }

  try {
    const res = await fetch("/api/comments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const textRes = await res.text();

    if (!textRes) {
      throw new Error("Empty response from server");
    }

    const data = JSON.parse(textRes);

    if (!data.success) {
      throw new Error("Comment failed");
    }

    onAdd({
      ...data,
      replies: [],
    });

    setText("");
    onCancel?.();
  } catch (err) {
    console.error("Comment submit failed:", err);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="mt-2">
      <textarea
        ref={inputRef}
        value={text}
        onChange={e => setText(e.target.value)}
        rows={2}
        placeholder="Post your reply"
        className="w-full resize-none bg-transparent outline-none text-sm"
      />

      <div className="flex justify-end gap-2 mt-2">
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-gray-500"
          >
            Cancel
          </button>
        )}
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="px-4 py-1.5 rounded-full bg-[#1D9BF0] text-white text-sm"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
