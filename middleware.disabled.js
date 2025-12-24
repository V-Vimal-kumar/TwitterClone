import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // 🚫 Not logged in → block feed
  if (!token && pathname.startsWith("/feed")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Logged in → block login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed/:path*", "/login", "/register"],
};
