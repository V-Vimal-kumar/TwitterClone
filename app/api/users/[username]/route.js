import { NextResponse } from "next/server";
import { getUserByUsername } from "@/services/user.service";

export async function GET(req, { params }) {
  const { username } = await params; // ✅ FIX

  const user = await getUserByUsername(username);

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}
