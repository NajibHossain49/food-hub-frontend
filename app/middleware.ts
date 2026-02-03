import { NextRequest, NextResponse } from "next/server";
import { authClient } from "./lib/auth-client";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin/* routes
  if (pathname.startsWith("/admin")) {
    const session = await authClient.getSession(); // Server-side session check

    if (!session?.user) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
