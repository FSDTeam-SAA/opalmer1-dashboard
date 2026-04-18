import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/login", "/api/auth"];
const ALLOWED_ROLES = new Set(["admin", "administrator"]);

/**
 * NextAuth.js stores its session under one of two cookies depending on
 * whether the request is over https. We clear both on a forbidden role so
 * the user lands on /login fresh instead of bouncing between dashboards.
 */
const SESSION_COOKIES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

function dashboardFor(role: string): string {
  return role === "admin" ? "/admin/dashboard" : "/administrator/dashboard";
}

function clearSessionAndRedirect(url: URL): NextResponse {
  const res = NextResponse.redirect(url);
  for (const name of SESSION_COOKIES) {
    res.cookies.delete(name);
  }
  return res;
}

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

  const role = (token.role as string) ?? "";

  // Roles like "user" (teachers/students/parents) have no dashboard yet.
  // Without this guard the two role checks below would ping-pong forever
  // (admin route bounces to /administrator → administrator route bounces
  // to /admin → ERR_TOO_MANY_REDIRECTS).
  if (!ALLOWED_ROLES.has(role)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "role-forbidden");
    return clearSessionAndRedirect(loginUrl);
  }

  // Root path → redirect to appropriate dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
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
