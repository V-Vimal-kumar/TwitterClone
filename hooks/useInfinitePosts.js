// hooks/useInfinitePosts.js
"use client";

import { useEffect, useRef, useState } from "react";

const PAGE_SIZE = 5;

export default function useInfinitePosts() {
  const [posts, setPosts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef(null);

  // 🔹 Fetch posts from backend
  const fetchPosts = async ({ initial = false } = {}) => {
    try {
      initial ? setInitialLoading(true) : setIsFetchingMore(true);

      const res = await fetch(
        `/api/posts?limit=${PAGE_SIZE}${cursor ? `&cursor=${cursor}` : ""}`,
        {
          credentials: "include", // JWT cookie
        }
      );

      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();

      setPosts(prev =>
        initial ? data.posts : [...prev, ...data.posts]
      );
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Post fetch error:", err);
    } finally {
      setInitialLoading(false);
      setIsFetchingMore(false);
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    fetchPosts({ initial: true });
  }, []);

  // 🔹 Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isFetchingMore &&
          !initialLoading
        ) {
          fetchPosts();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [isFetchingMore, initialLoading, hasMore]);

  return {
    posts,
    initialLoading,
    isFetchingMore,
    loadMoreRef,
  };
}
