import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // 🚫 Not logged in → block protected pages
  if (!token && pathname.startsWith("/feed")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Logged in → block auth pages
  if (token && isAuthPage) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return NextResponse.redirect(new URL("/feed", req.url));
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ✅ Logged in → allow feed
  if (token && pathname.startsWith("/feed")) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/feed/:path*",
    "/login",
    "/register",
  ],
};
