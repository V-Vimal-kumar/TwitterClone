import { NextResponse } from "next/server";
import { getPostsByUser } from "@/services/post.service";

export async function GET(req, { params }) {
  const { username } = await params; 

  const posts = await getPostsByUser(username);
  return NextResponse.json(posts);
}
