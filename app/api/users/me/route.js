import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { updateUserProfile, getUserById } from "@/services/user.service";

export async function PUT(req) {
  const user =await getUserFromToken();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { name, bio, avatar_url } = body;

  // Basic validation
  if (!name || name.trim().length === 0) {
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

  return NextResponse.json({ message: "Profile updated" });
}

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