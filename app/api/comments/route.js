import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import {
  addComment,
  getCommentsByPost,
  deleteComment
} from "@/services/comment.service";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId, content, parentCommentId, replyToUserId } =
      await req.json();

    if (!postId || !content) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const id = await addComment(
      user.id,
      postId,
      content,
      parentCommentId ?? null,
      replyToUserId ?? null
    );

    const [[dbUser]] = await db.query(
      `SELECT id, name, username, avatar_url FROM users WHERE id = ?`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      id,
      content,
      parentId: parentCommentId ?? null,
      author: {
        id: dbUser.id,
        name: dbUser.name,
        username: dbUser.username,
        avatar_url: dbUser.avatar_url,
      },
      replyTo: replyToUserId ? { username: null } : null,
      replies: [],
    });

  } catch (err) {
    console.error("POST /comments error:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  const comments = await getCommentsByPost(postId);
  return NextResponse.json(comments);
}

export async function DELETE(req) {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { commentId } = await req.json();

  const result = await deleteComment(commentId, user.id);

  if (!result.deleted) {
    return NextResponse.json(
      { success: false },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true });
}
