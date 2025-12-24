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
      users.id AS userId,
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

  // 🔥 SHAPE DATA FOR FRONTEND
  return rows.map(row => ({
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    author: {
      id: row.userId,
      name: row.name,
      username: row.username,
      avatar_url: row.avatar_url,
    },
  }));
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
