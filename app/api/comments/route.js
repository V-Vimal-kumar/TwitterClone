import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import {
  addComment,
  getCommentsByPost,
  deleteComment,
} from "@/services/comment.service";

export async function POST(req) {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { postId, content } = await req.json();

  if (!postId || !content) {
    return NextResponse.json(
      { message: "postId and content required" },
      { status: 400 }
    );
  }

  const commentId = await addComment(user.id, postId, content);

  // 🔥 RETURN FULL COMMENT SHAPE
  return NextResponse.json(
    {
      id: commentId,
      content,
      createdAt: new Date(),
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar_url: user.avatar_url,
      },
    },
    { status: 201 }
  );
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { message: "postId required" },
      { status: 400 }
    );
  }

  const comments = await getCommentsByPost(postId);

  return NextResponse.json(comments);
}

export async function DELETE(req) {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { commentId } = await req.json();

  if (!commentId) {
    return NextResponse.json(
      { message: "commentId required" },
      { status: 400 }
    );
  }

  await deleteComment(commentId, user.id);

  return NextResponse.json({ message: "Comment deleted" });
}
