import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import {
  updateUserProfile,
  getUserById,
} from "@/services/user.service";

// UPDATE PROFILE
export async function PUT(req) {
  const user = await getUserFromToken();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { name, bio, avatar_url } = await req.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { message: "Name is required" },
      { status: 400 }
    );
  }

  if (bio && bio.length > 160) {
    return NextResponse.json(
      { message: "Bio must be under 160 characters" },
      { status: 400 }
    );
  }

  await updateUserProfile(user.id, {
    name,
    bio: bio || null,
    avatar_url: avatar_url || null,
  });

  // 🔥 return updated user
  const updatedUser = await getUserById(user.id);

  return NextResponse.json(updatedUser);
}

// GET MY PROFILE
export async function GET() {
  const user = await getUserFromToken();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(dbUser);
}
