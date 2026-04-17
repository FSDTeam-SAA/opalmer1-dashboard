import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/login", "/api/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths — login page and auth API are accessible to everyone
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get the token for protected routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No token → redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string;

  // Root path → redirect to appropriate dashboard
  if (pathname === "/") {
    const dashboardUrl =
      role === "admin" ? "/admin/dashboard" : "/administrator/dashboard";
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdministratorRoute =
    pathname === "/administrator" || pathname.startsWith("/administrator/");

  // Admin routes: only "admin" role
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(
      new URL("/administrator/dashboard", request.url),
    );
  }

  // Administrator routes: only "administrator" role
  if (isAdministratorRoute && role !== "administrator") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
