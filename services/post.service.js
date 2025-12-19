import db from "@/lib/db";

export async function createPost(userId, content, image_url) {
  const [res] = await db.query(
    "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)",
    [userId, content, image_url]
  );
  return res.insertId;
}

export async function getFeed() {
  const [rows] = await db.query(`
    SELECT posts.*, users.username, users.name, users.avatar_url,
    (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likeCount
    FROM posts
    JOIN users ON users.id = posts.user_id
    ORDER BY posts.created_at DESC
  `);
  return rows;
}

export async function getPostsByUser(username) {
  const [rows] = await db.query(`
    SELECT posts.*
    FROM posts
    JOIN users ON users.id = posts.user_id
    WHERE users.username = ?
    ORDER BY posts.created_at DESC
  `, [username]);
  return rows;
}

export async function deletePost(postId, userId) {
  await db.query(
    "DELETE FROM posts WHERE id=? AND user_id=?",
    [postId, userId]
  );
}
