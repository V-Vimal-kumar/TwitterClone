import db from "@/lib/db";

// Used for login
export async function findUserByEmailOrUsername(identifier) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [identifier, identifier]
  );
  return rows[0];
}

// Used for register
export async function createUser({ name, username, email, passwordHash }) {
  await db.query(
    `
    INSERT INTO users (name, username, email, password_hash)
    VALUES (?, ?, ?, ?)
    `,
    [name, username, email, passwordHash]
  );
}

// Used for profile view
export async function getUserByUsername(username) {
  const [rows] = await db.query(
    `
    SELECT id, name, username, bio, avatar_url
    FROM users
    WHERE username = ?
    `,
    [username]
  );
  return rows[0];
}

// Used for edit profile (ONLY ONE VERSION)
export async function updateUserProfile(userId, { name, bio, avatar_url }) {
  await db.query(
    `
    UPDATE users
    SET name = ?, bio = ?, avatar_url = ?
    WHERE id = ?
    `,
    [name, bio, avatar_url, userId]
  );
}

export async function getUserById(userId) {
  const [rows] = await db.query(
    `
    SELECT id, name, username, email, bio, avatar_url
    FROM users
    WHERE id = ?
    `,
    [userId]
  );

  return rows[0];
}