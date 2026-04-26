import { NextResponse } from "next/server";
import { useProfileQuery } from "./redux/services/auth/authApi";

export function middleware(request) {
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

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

  return NextResponse.next();
}
