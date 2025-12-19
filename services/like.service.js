import db from "@/lib/db";

export async function likePost(userId, postId) {
  try {
    await db.query(
      "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
      [userId, postId]
    );
  } catch (err) {
    // Ignore duplicate likes
    if (err.code !== "ER_DUP_ENTRY") {
      throw err;
    }
  }
}

export async function unlikePost(userId, postId) {
  await db.query(
    "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
    [userId, postId]
  );
}

export async function isPostLikedByUser(userId, postId) {
  const [rows] = await db.query(
    "SELECT id FROM likes WHERE user_id = ? AND post_id = ?",
    [userId, postId]
  );
  return rows.length > 0;
}
