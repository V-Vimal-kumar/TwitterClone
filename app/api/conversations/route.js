import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) return NextResponse.json([], { status: 200 });

    const userId = Number(user.id);

    const [rows] = await pool.query(
      `
      SELECT
        c.id,
        c.last_message,
        c.last_message_at,
        u.id AS user_id,
        u.name,
        u.username,
        u.avatar_url,
        (
          SELECT COUNT(*)
          FROM messages m
          WHERE m.conversation_id = c.id
            AND m.sender_id != ?
            AND m.created_at >
              CASE
                WHEN c.user1_id = ? THEN c.last_read_user1
                ELSE c.last_read_user2
              END
        ) AS unread_count
      FROM conversations c
      JOIN users u
        ON u.id =
          CASE
            WHEN c.user1_id = ? THEN c.user2_id
            ELSE c.user1_id
          END
      WHERE c.user1_id = ? OR c.user2_id = ?
      ORDER BY c.last_message_at DESC
      `,
      [userId, userId, userId, userId, userId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/conversations error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
