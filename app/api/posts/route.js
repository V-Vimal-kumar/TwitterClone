import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import {createPost,getFeed,getPostsByUser} from "@/services/post.service";
import cloudinary from "@/lib/cloudinary";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

  if (username) {
  const user = await getUserFromToken();
  const posts = await getPostsByUser(username, user?.id || 0);
  return NextResponse.json(posts || []);
}


    const user = await getUserFromToken();
    const posts = await getFeed(user?.id || 0);
    return NextResponse.json(posts || []);
  } catch (err) {
    console.error("GET /posts error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req) {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { content, image_url } = await req.json();

  if (!content?.trim() && !image_url) {
    return NextResponse.json(
      { message: "Post content or image required" },
      { status: 400 }
    );
  }

  const postId = await createPost(user.id, content || "", image_url || null);

  return NextResponse.json({
    id: postId,
    content,
    image: image_url,
    author: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar_url: user.avatar_url,
    },
    likesCount: 0,
    commentsCount: 0,
    createdAt: "now",
  });
}