import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function getUserFromToken() {
  try {
    const cookieStore = cookies(); // ❌ NO await
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // 🔥 never throw
    return null;
  }
}
