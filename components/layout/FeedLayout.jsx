"use client";

import { useEffect, useState } from "react";
import TweetComposer from "../tweet/TweetComposer";
import TweetCard from "../tweet/TweetCard";
import TweetSkeleton from "../tweet/TweetSkeleton";
import useInfinitePosts from "@/hooks/useInfinitePosts";

export default function FeedLayout() {
  const { posts, setPosts, initialLoading } = useInfinitePosts();
  const [currentUser, setCurrentUser] = useState(null);

  // 🔑 Fetch logged-in user
  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(setCurrentUser)
      .catch(() => {});
  }, []);

  return (
    <section className="w-full md:max-w-[680px] xl:max-w-[680px] border-x border-[var(--border)]">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="flex h-[53px]">
          <div className="flex-1 flex items-center justify-center font-semibold relative">
            For you
            <span className="absolute bottom-0 h-1 w-14 rounded-full bg-[#1D9BF0]" />
          </div>
          <div className="flex-1 flex items-center justify-center text-[#71767B]">
            Following
          </div>
        </div>
      </div>

      {/* FEED */}
      <div className="flex-1 overflow-y-auto">

        {/* ✅ PASS USER HERE */}
        <TweetComposer
          user={currentUser}
          onPostCreated={post =>
            setPosts(prev => [post, ...prev])
          }
        />

        {initialLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <TweetSkeleton key={`skeleton-${i}`} />
          ))}

        {!initialLoading &&
          posts.map(post => (
            <TweetCard key={post.id} post={post} />
          ))}
      </div>
    </section>
  );
}
