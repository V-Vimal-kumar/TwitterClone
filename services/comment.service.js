import db from "@/lib/db";

export async function addComment(
  userId,
  postId,
  content,
  parentCommentId = null,
  replyToUserId = null
) {
  // ❌ Block reply-to-reply
  if (parentCommentId) {
    const [[parent]] = await db.query(
      `SELECT parent_comment_id FROM comments WHERE id = ?`,
      [parentCommentId]
    );

    if (!parent || parent.parent_comment_id !== null) {
      throw new Error("Replies to replies are not allowed");
    }
  }

  const [res] = await db.query(
    `
    INSERT INTO comments
    (user_id, post_id, content, parent_comment_id, reply_to_user_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, postId, content, parentCommentId, replyToUserId]
  );

  return res.insertId;
}

export async function getCommentsByPost(postId) {
  const [rows] = await db.query(
    `
    SELECT
      c.id,
      c.content,
      c.created_at,
      c.parent_comment_id,
      c.reply_to_user_id,
      u.id AS userId,
      u.username,
      u.name,
      u.avatar_url,
      ru.username AS reply_to_username
    FROM comments c
    JOIN users u ON u.id = c.user_id
    LEFT JOIN users ru ON ru.id = c.reply_to_user_id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
    `,
    [postId]
  );

  return shapeComments(rows);
}

function shapeComments(rows) {
  const map = {};
  const roots = [];

  rows.forEach(row => {
    map[row.id] = {
      id: row.id,
      content: row.content,
      createdAt: row.created_at,

      // 🔥 THIS IS WHAT FIXES REFRESH
      parentId: row.parent_comment_id,

      author: {
        id: row.userId,
        name: row.name,
        username: row.username,
        avatar_url: row.avatar_url,
      },

      replyTo: row.reply_to_username
        ? { username: row.reply_to_username }
        : null,

      replies: [],
    };
  });

  rows.forEach(row => {
    if (row.parent_comment_id) {
      map[row.parent_comment_id]?.replies.push(map[row.id]);
    } else {
      roots.push(map[row.id]);
    }
  });

  return roots;
}

export async function deleteComment(commentId, userId) {
  // 1️⃣ Find comment + post owner
  const [[row]] = await db.query(
    `
    SELECT 
      c.user_id AS commentOwnerId,
      p.user_id AS postOwnerId
    FROM comments c
    JOIN posts p ON p.id = c.post_id
    WHERE c.id = ?
    `,
    [commentId]
  );

  if (!row) return { deleted: false };

  // 2️⃣ Permission check
  const canDelete =
    row.commentOwnerId === userId ||
    row.postOwnerId === userId;

  if (!canDelete) {
    return { deleted: false };
  }

  // 3️⃣ Delete
  await db.query(
    `DELETE FROM comments WHERE id = ?`,
    [commentId]
  );

  return { deleted: true };
}