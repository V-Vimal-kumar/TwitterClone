"use client";

import { useEffect, useState } from "react";
import CommentComposer from "./CommentComposer";
import CommentItem from "./CommentItem";

export default function CommentList({
  postId,
  currentUserId,
  postOwnerId,
}) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      const res = await fetch(
        `/api/comments?postId=${postId}`,
        { credentials: "include" }
      );

      const text = await res.text();
      if (!text) {
        setComments([]);
        return;
      }

      const data = JSON.parse(text);
      setComments(
        Array.isArray(data)
          ? data.map(c => ({
              ...c,
              replies: c.replies ?? [],
            }))
          : []
      );
    };

    loadComments();
  }, [postId]);

  const addReply = (parentId, reply) => {
    setComments(prev =>
      prev.map(c =>
        c.id === parentId
          ? { ...c, replies: [...c.replies, reply] }
          : c
      )
    );
  };

const deleteComment = async commentId => {
  const res = await fetch("/api/comments", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commentId }),
  });

  const data = await res.json();

  if (!data.success) return;

  setComments(prev =>
    prev
      .filter(c => c.id !== commentId)
      .map(c => ({
        ...c,
        replies: c.replies.filter(r => r.id !== commentId),
      }))
  );
};


  return (
    <div className="mt-4 border-t border-[var(--border)] pt-4 space-y-6">
      <CommentComposer
        postId={postId}
        onAdd={c =>
          setComments(prev => [
            ...prev,
            { ...c, replies: [] },
          ])
        }
      />

      {/* Comments */}
      <div className="space-y-6">
        {comments.map(c => (
          <CommentItem
            key={c.id}
            comment={c}
            postId={postId}
            onReply={addReply}
            onDelete={deleteComment}
            currentUserId={currentUserId}
            postOwnerId={postOwnerId}
          />
        ))}
      </div>
    </div>
  );
}
