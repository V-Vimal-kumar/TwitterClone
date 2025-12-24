"use client";

import Link from "next/link";

export default function CommentItem({ comment }) {
  if (!comment?.author) return null;

  return (
    <div className="flex gap-3">
      {/* AVATAR */}
      <Link
        href={`/profile/${comment.author.username}`}
        className="flex-shrink-0"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--border)]">
          {comment.author.avatar_url ? (
            <img
              src={comment.author.avatar_url}
              alt={comment.author.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[var(--border)]" />
          )}
        </div>
      </Link>

      {/* CONTENT */}
      <div className="text-sm">
        <div className="flex gap-1">
          <Link
            href={`/profile/${comment.author.username}`}
            className="font-semibold hover:underline"
          >
            {comment.author.name}
          </Link>
          <span className="text-[#71767B]">
            @{comment.author.username}
          </span>
        </div>

        <p className="mt-1 text-[15px] leading-5">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
