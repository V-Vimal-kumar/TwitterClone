import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function POST(req) {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { conversationId } = await req.json();

  const [[conv]] = await pool.query(
    `SELECT user1_id, user2_id FROM conversations WHERE id = ?`,
    [conversationId]
  );

  if (!conv) return NextResponse.json({}, { status: 404 });

  const field =
    conv.user1_id === user.id ? "last_read_user1" : "last_read_user2";

  await pool.query(
    `UPDATE conversations SET ${field} = NOW() WHERE id = ?`,
    [conversationId]
  );

  await pool.query(
  `
  UPDATE messages
  SET read_at = NOW()
  WHERE conversation_id = ?
  AND receiver_id = ?
  AND read_at IS NULL
  `,
  [conversationId, user.id]
);


  return NextResponse.json({ ok: true });
}
