"use client";

import Link from "next/link";
import { useState } from "react";
import TweetActions from "./TweetActions";
import CommentList from "../comments/CommentList";

export default function TweetCard({ post }) {
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);

  if (!post?.author) return null;

  const toggleLike = async () => {
    const nextLiked = !liked;

    setLiked(nextLiked);
    setLikesCount(c => (nextLiked ? c + 1 : c - 1));

    await fetch("/api/likes", {
      method: nextLiked ? "POST" : "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    });
  };

  return (
    <article className="flex gap-3 px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors cursor-pointer">
      {/* Avatar */}
      <Link
        href={`/profile/${post.author.username}`}
        className="flex-shrink-0"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--border)]">
          {post.author.avatar_url ? (
            <img
              src={post.author.avatar_url}
              alt={post.author.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[var(--border)]" />
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[15px] leading-5">
          <Link href={`/profile/${post.author.username}`}>
            <span className="font-bold hover:underline cursor-pointer">
              {post.author.name}
            </span>
          </Link>
          <span className="text-[#71767B] truncate">@{post.author.username}</span>
          <span className="text-[#71767B]">·</span>
          <span className="text-[#71767B]">{post.createdAt}</span>
        </div>

        <p className="mt-1 text-[15px] leading-[20px] whitespace-pre-wrap">
          {post.content}
        </p>

        {post.image && (
          <img
            src={post.image}
            alt="tweet"
            className="mt-3 rounded-2xl max-h-[500px] object-cover"
          />
        )}

        <TweetActions
          liked={liked}
          likesCount={likesCount}
          commentsCount={post.commentsCount}
          onLike={toggleLike}
          onComment={() => setShowComments(v => !v)}
        />

        {showComments && <CommentList postId={post.id} />}
      </div>
    </article>
  );
}
