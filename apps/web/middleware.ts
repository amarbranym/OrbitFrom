import { SESSION_COOKIE_NAME } from "@repo/auth/constants";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PATHS = ["/login", "/signup", "/verify-otp"];
const PROTECTED_PREFIX = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(sessionToken);

  console.log(`[Middleware] Path: ${pathname}, Token found: ${Boolean(sessionToken)}, Token: ${sessionToken ? sessionToken.substring(0, 8) + "..." : "none"}`);
  console.log(`[Middleware] All cookies:`, request.cookies.getAll().map(c => c.name));
  console.log(`[Middleware] Raw Cookie Header:`, request.headers.get("cookie"));

  const isAuthRoute = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isProtectedRoute = pathname.startsWith(PROTECTED_PREFIX);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/verify-otp"],
};
