"use client";

import { useEffect, useState } from "react";
import CommentComposer from "./CommentComposer";
import CommentItem from "./CommentItem";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/comments?postId=${postId}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  return (
    <div className="mt-3 border-t border-[var(--border)] pl-10">
      <CommentComposer
        postId={postId}
        onAdd={comment =>
          setComments(prev => [...prev, comment])
        }
      />

      <div className="space-y-4">
        {comments.map((c, index) => (
          <CommentItem
            key={c.id ?? `${postId}-${index}`}
            comment={c}
          />
        ))}
      </div>
    </div>
  );
}