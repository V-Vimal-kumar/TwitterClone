import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { createUser } from "@/services/user.service";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, username, email, password } = body;

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    await createUser({ name, username, email, passwordHash });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

  } catch (error) {
    // 🔥 DUPLICATE EMAIL OR USERNAME
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("email")) {
        return NextResponse.json(
          { message: "Email already registered" },
          { status: 409 }
        );
      }

      if (error.message.includes("username")) {
        return NextResponse.json(
          { message: "Username already taken" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // 🔴 UNKNOWN ERROR
    console.error("Register error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
