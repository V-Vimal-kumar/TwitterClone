import db from "@/lib/db";

export async function createPost(userId, content, image_url) {
  const [res] = await db.query(
    "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)",
    [userId, content, image_url]
  );
  return res.insertId;
}

export async function getFeed(userId) {
  const [rows] = await db.query(`
    SELECT 
      posts.id,
      posts.content,
      posts.image_url,
      posts.created_at,

      users.id AS userId,
      users.username,
      users.name,
      users.avatar_url,

      -- likes count
      (
        SELECT COUNT(*) 
        FROM likes 
        WHERE likes.post_id = posts.id
      ) AS likesCount,

      -- liked by current user
      (
        SELECT COUNT(*) 
        FROM likes 
        WHERE likes.post_id = posts.id
        AND likes.user_id = ?
      ) AS liked,

      -- 🔥 comments count (THIS WAS MISSING)
      (
        SELECT COUNT(*)
        FROM comments
        WHERE comments.post_id = posts.id
      ) AS commentsCount

    FROM posts
    JOIN users ON users.id = posts.user_id
    ORDER BY posts.created_at DESC
  `, [userId]);

  return rows.map(row => ({
    id: row.id,
    content: row.content,
    image: row.image_url,
    createdAt: row.created_at,
    likesCount: Number(row.likesCount),
    liked: Boolean(row.liked),
    commentsCount: Number(row.commentsCount), 
    author: {
      id: row.userId,
      name: row.name,
      username: row.username,
      avatar_url: row.avatar_url,
    },
  }));
}

export async function getPostsByUser(username, viewerId = 0) {
  const [rows] = await db.query(`
    SELECT 
      posts.id,
      posts.content,
      posts.image_url,
      posts.created_at,

      users.id AS userId,
      users.name,
      users.username,
      users.avatar_url,

      (
        SELECT COUNT(*) 
        FROM likes 
        WHERE likes.post_id = posts.id
      ) AS likesCount,

      (
        SELECT COUNT(*) 
        FROM comments 
        WHERE comments.post_id = posts.id
      ) AS commentsCount,

      (
        SELECT COUNT(*) 
        FROM likes 
        WHERE likes.post_id = posts.id
        AND likes.user_id = ?
      ) AS liked

    FROM posts
    JOIN users ON users.id = posts.user_id
    WHERE users.username = ?
    ORDER BY posts.created_at DESC
  `, [viewerId, username]);

  return rows.map(row => ({
    id: row.id,
    content: row.content,
    image: row.image_url,
    createdAt: row.created_at,
    likesCount: Number(row.likesCount),
    commentsCount: Number(row.commentsCount),
    liked: Boolean(row.liked),
    author: {
      id: row.userId,
      name: row.name,
      username: row.username,
      avatar_url: row.avatar_url,
    },
  }));
}


export async function deletePost(postId, userId) {
  await db.query(
    "DELETE FROM posts WHERE id=? AND user_id=?",
    [postId, userId]
  );
}
