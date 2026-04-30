import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const role = request.cookies.get("role")?.value;
  const token = request.cookies.get("access_token")?.value;
  const isBanned = request.cookies.get("is_banned")?.value;

  if (pathname.includes("/login") || pathname.includes("/register")) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.includes("/dashboard")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const protectedRoutes = ["/profile", "/dashboard"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isBlocked = isBanned === "true";
  if (isBlocked) {
    const allowedPaths = ["/", "/contact", "/login"];
    const isAllowed = allowedPaths.includes(pathname);

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
