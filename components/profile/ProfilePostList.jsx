"use client";

import { useEffect, useState } from "react";
import TweetCard from "@/components/tweet/TweetCard";

export default function ProfilePostList({ username }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch(`/api/posts?username=${username}`);

        if (!res.ok) {
          setPosts([]);
          return;
        }

        const text = await res.text();
        if (!text) {
          setPosts([]);
          return;
        }

        const data = JSON.parse(text);
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Profile posts error:", err);
        setPosts([]);
      }
    };

    loadPosts();
  }, [username]);

  return (
    <>
      {posts.map(post => (
        <TweetCard key={post.id} post={post} />
      ))}
    </>
  );
}
