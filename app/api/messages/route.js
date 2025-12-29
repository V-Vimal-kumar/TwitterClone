import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromToken } from "@/lib/getUserFromToken";

/* ======================================================
   SEND MESSAGE
====================================================== */
export async function POST(req) {
  try {
    const body = await req.json();

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const senderId = Number(user.id);
    const receiverId = Number(body.receiverId);
    const text = body.text?.trim();

    if (!Number.isFinite(senderId) || !Number.isFinite(receiverId) || !text) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const user1 = Math.min(senderId, receiverId);
    const user2 = Math.max(senderId, receiverId);

    const [[existing]] = await pool.query(
      `SELECT id FROM conversations WHERE user1_id = ? AND user2_id = ?`,
      [user1, user2]
    );

    let conversationId = existing?.id;

    if (!conversationId) {
      const [res] = await pool.query(
        `INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)`,
        [user1, user2]
      );
      conversationId = res.insertId;
    }

    // 🔥 insert message
    const [msgRes] = await pool.query(
      `
      INSERT INTO messages
        (conversation_id, sender_id, receiver_id, text)
      VALUES (?, ?, ?, ?)
      `,
      [conversationId, senderId, receiverId, text]
    );

    const messageId = msgRes.insertId;

    await pool.query(
      `
      UPDATE conversations
      SET last_message = ?, last_message_at = NOW()
      WHERE id = ?
      `,
      [text, conversationId]
    );

    return NextResponse.json({
      conversationId,
      message: {
        id: messageId,
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        text,
        created_at: new Date().toISOString(),
        delivered_at: null,
        read_at: null,
      },
    });
  } catch (err) {
    console.error("POST /api/messages error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ======================================================
   GET CHAT HISTORY
====================================================== */
export async function GET(req) {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(user.id);
  const { searchParams } = new URL(req.url);
  const conversationId = Number(searchParams.get("conversationId"));

  if (!conversationId) {
    return NextResponse.json(
      { message: "conversationId required" },
      { status: 400 }
    );
  }

  const [[allowed]] = await pool.query(
    `
    SELECT id FROM conversations
    WHERE id = ? AND (user1_id = ? OR user2_id = ?)
    `,
    [conversationId, userId, userId]
  );

  if (!allowed) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const [messages] = await pool.query(
    `
    SELECT
      id,
      conversation_id,
      sender_id,
      receiver_id,
      text,
      created_at,
      delivered_at,
      read_at
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
    `,
    [conversationId]
  );

  return NextResponse.json(messages);
}
