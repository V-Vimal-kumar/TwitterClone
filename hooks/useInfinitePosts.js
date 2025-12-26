"use client";

import { useEffect, useRef, useState } from "react";

export default function useInfinitePosts() {
  const [posts, setPosts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadMoreRef = useRef(null);

  const fetchPosts = async () => {
    setInitialLoading(true);

    try {
      const res = await fetch("/api/posts", {
        credentials: "include",
      });

      // 🚫 FAIL SOFTLY — NEVER THROW
      if (!res.ok) {
        setPosts([]);
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Posts API must return array", data);
        setPosts([]);
        return;
      }

      setPosts(prev => {
        const map = new Map(prev.map(p => [p.id, p]));
        data.forEach(p => map.set(p.id, p));
        return Array.from(map.values());
      });
    } catch (err) {
      console.error("Post fetch error:", err);
      setPosts([]);
    } finally {
      setInitialLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    setPosts,
    initialLoading,
    isFetchingMore,
    loadMoreRef,
  };
}
