"use client";

import TweetComposer from "../tweet/TweetComposer";
import TweetCard from "../tweet/TweetCard";
import TweetSkeleton from "../tweet/TweetSkeleton";
import useInfinitePosts from "@/hooks/useInfinitePosts";

export default function FeedLayout() {
  const {
    posts,
    initialLoading,
    isFetchingMore,
    loadMoreRef,
  } = useInfinitePosts();

  return (
    <section className="w-full md:max-w-[680px] xl:max-w-[680px] border-x border-[var(--border)]">

      {/* STICKY HEADER */}
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

      {/* SCROLLING FEED CONTENT */}
      <div className="flex-1 overflow-y-auto">

        <TweetComposer />

        {initialLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <TweetSkeleton key={i} />
          ))}

        {!initialLoading &&
          posts.map(post => (
            <TweetCard key={post.id} post={post} />
          ))}

        {isFetchingMore &&
          Array.from({ length: 2 }).map((_, i) => (
            <TweetSkeleton key={`more-${i}`} />
          ))}

        <div ref={loadMoreRef} className="h-1" />
      </div>
    </section>
  );
}
