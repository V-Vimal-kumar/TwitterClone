import { NextResponse } from "next/server";
import { comparePassword, signToken } from "@/lib/auth";
import { findUserByEmailOrUsername } from "@/services/user.service";

export async function POST(req) {
  const { identifier, password } = await req.json();

  const user = await findUserByEmailOrUsername(identifier);
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const match = await comparePassword(password, user.password_hash);
  if (!match) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = signToken({
    id: user.id,
    username: user.username,
  });
  
  const res = NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
    },
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return res;
}
