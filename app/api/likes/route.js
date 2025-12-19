import { NextResponse } from "next/server";
import { likePost, unlikePost } from "@/services/like.service";
import { getUserFromToken } from "@/lib/getUserFromToken";


export async function POST(req) {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json(
      { message: "postId required" },
      { status: 400 }
    );
  }

  await likePost(user.id, postId);

  return NextResponse.json({ message: "Post liked" });
}

export async function DELETE(req) {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json(
      { message: "postId required" },
      { status: 400 }
    );
  }

  await unlikePost(user.id, postId);

  return NextResponse.json({ message: "Like removed" });
}
