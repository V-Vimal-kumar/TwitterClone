"use client";

import Link from "next/link";
import { useState } from "react";
import CommentComposer from "./CommentComposer";

export default function CommentItem({
  comment,
  postId,
  onReply,
  onDelete,
  currentUserId,
  postOwnerId,
}) {
  const [replying, setReplying] = useState(false);
  const isReply = Boolean(comment.parentId);

  const canDelete =
    comment.author.id === currentUserId ||
    postOwnerId === currentUserId;

  return (
    <div
      className={`flex gap-3 group ${
        isReply
          ? "ml-10 pl-4 border-l border-[var(--border)]"
          : ""
      }`}
    >
      {/* Avatar */}
      <Link href={`/profile/${comment.author.username}`}>
        <img
          src={comment.author.avatar_url}
          alt={comment.author.name}
          className="w-9 h-9 rounded-full object-cover"
        />
      </Link>

      {/* Body */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">
            {comment.author.name}
          </span>
          <span className="text-[var(--muted)]">
            @{comment.author.username}
          </span>

          {/* Delete (hover only) */}
          {canDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="ml-auto text-xs text-red-500 opacity-0 group-hover:opacity-100 transition"
            >
              Delete
            </button>
          )}
        </div>

        {/* Replying to */}
        {comment.replyTo && (
          <div className="text-xs text-[#1D9BF0] mt-0.5">
            Replying to                                                    
                {/* @{comment.replyTo.username} */}
          </div>
        )}

        {/* Content */}
        <p className="mt-1 text-sm leading-5 whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Actions */}
        {!isReply && (
          <button
            onClick={() => setReplying(true)}
            className="mt-1 text-xs text-[var(--muted)] hover:text-[#1D9BF0] transition"
          >
            Reply
          </button>
        )}

        {/* Reply Composer */}
        {replying && (
          <div className="mt-2">
            <CommentComposer
              postId={postId}
              parentCommentId={comment.id}
              replyToUser={comment.author}
              onAdd={reply => {
                onReply(comment.id, reply);
                setReplying(false);
              }}
              onCancel={() => setReplying(false)}
            />
          </div>
        )}

        {/* Replies */}
        <div className="mt-3 space-y-4">
          {(comment.replies ?? []).map(r => (
            <CommentItem
              key={r.id}
              comment={r}
              postId={postId}
              onReply={() => {}}
              onDelete={onDelete}
              currentUserId={currentUserId}
              postOwnerId={postOwnerId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
