import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { createPost, getFeed } from "@/services/post.service";

export async function GET() {
  const posts = await getFeed();
  return NextResponse.json(posts);
}

export async function POST(req) {
  const user = await getUserFromToken(); // ✅ await

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { content, image_url } = await req.json();

  if (!content || !content.trim()) {
    return NextResponse.json(
      { message: "Post content required" },
      { status: 400 }
    );
  }

  await createPost(user.id, content, image_url || null);

  return NextResponse.json(
    { message: "Post created" },
    { status: 201 }
  );
}
