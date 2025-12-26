// hooks/useInfinitePosts.js
"use client";

import { useEffect, useRef, useState } from "react";

export default function useInfinitePosts() {
  const [posts, setPosts] = useState([]);          // ✅ always array
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadMoreRef = useRef(null); // kept for future use

  // 🔹 Fetch posts ONCE (no infinite loop)
  const fetchPosts = async () => {
    try {
      setInitialLoading(true);

      const res = await fetch("/api/posts", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Posts API must return array", data);
        setPosts([]);
        return;
      }

      // ✅ Deduplicate by post.id
      setPosts(prev => {
        const map = new Map(prev.map(p => [p.id, p]));
        data.forEach(p => map.set(p.id, p));
        return Array.from(map.values());
      });
    } catch (err) {
      console.error("Post fetch error:", err);
    } finally {
      setInitialLoading(false);
      setIsFetchingMore(false);
    }
  };

  // 🔹 Initial load ONLY
  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    setPosts,           // needed for TweetComposer
    initialLoading,
    isFetchingMore,
    loadMoreRef,        // unused for now
  };
}