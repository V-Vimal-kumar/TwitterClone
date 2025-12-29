import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      id: Number(decoded.id), // 🔥 MUST MATCH JWT PAYLOAD
    };
  } catch {
    return null;
  }
}
