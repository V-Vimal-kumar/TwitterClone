import db from "@/lib/db";

export async function addComment(userId, postId, content) {
  const [res] = await db.query(
    `
    INSERT INTO comments (user_id, post_id, content)
    VALUES (?, ?, ?)
    `,
    [userId, postId, content]
  );

  return res.insertId;
}

export async function getCommentsByPost(postId) {
  const [rows] = await db.query(
    `
    SELECT
      comments.id,
      comments.content,
      comments.created_at,
      users.username,
      users.name,
      users.avatar_url
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
    `,
    [postId]
  );

  return rows;
}

export async function deleteComment(commentId, userId) {
  await db.query(
    `
    DELETE FROM comments
    WHERE id = ? AND user_id = ?
    `,
    [commentId, userId]
  );
}
