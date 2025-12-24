import { NextResponse } from "next/server";
import pool from "@/lib/db"; // your mysql2 pool

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json([]);
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT id, name, username, avatar_url
      FROM users
      WHERE name LIKE ? OR username LIKE ?
      ORDER BY name
      LIMIT 10
      `,
      [`${q}%`, `${q}%`]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("User search error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
