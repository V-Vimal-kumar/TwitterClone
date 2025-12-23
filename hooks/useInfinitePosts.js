// hooks/useInfinitePosts.js
"use client";

import { useEffect, useRef, useState } from "react";
import allPosts from "@/data/posts.json";

const PAGE_SIZE = 5;

export default function useInfinitePosts() {
  const [count, setCount] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadMoreRef = useRef(null);

  // Initial load (page load)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(PAGE_SIZE);
      setInitialLoading(false);
    }, 800); // simulate API delay

    return () => clearTimeout(timer);
  }, []);

  // Load more on scroll (ONLY when trigger enters viewport)
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isFetchingMore &&
          !initialLoading &&
          count < allPosts.length
        ) {
          setIsFetchingMore(true);

          setTimeout(() => {
            setCount(c => Math.min(c + PAGE_SIZE, allPosts.length));
            setIsFetchingMore(false);
          }, 700);
        }
      },
      {
        rootMargin: "200px", 
      }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [count, isFetchingMore, initialLoading]);

  return {
    posts: allPosts.slice(0, count),
    initialLoading,
    isFetchingMore,
    loadMoreRef,
  };
}
