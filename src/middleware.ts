import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("=== Middleware Invoked ===");
  console.log("NODE_ENV:", process.env.NODE_ENV);

  console.log(
    "NEXTAUTH_SECRET (length):",
    process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.length : "Not set"
  );

  console.log("Request Details:");
  console.log("• Method:", request.method);
  console.log("• URL:", request.url);
  console.log("• Headers:");
  request.headers.forEach((value, key) => console.log(`  - ${key}: ${value}`));

  // Debugging Cookies
  console.log("• Cookies:");
  const cookies = request.cookies.getAll();
  if (cookies.length === 0) {
    console.warn("  - No cookies found in the request.");
  } else {
    cookies.forEach((cookie) => {
      console.log(`  - ${cookie.name}: ${cookie.value.slice(0, 10)}...`); // Log first 10 chars to avoid long output
    });
  }

  console.log("Attempting to retrieve the token...");
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "next-auth.session-token",
    raw: true,
  });

  console.log("Retrieved Token:", token ? "✅ Token Found" : "❌ Token Missing");

  if (!token) {
    console.warn("❗ No valid token found. User may not be authenticated.");
  }

  // Protected route handling
  const protectedRoutes = ["/dashboard", "/protected-route"];
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!token && isProtected) {
    console.log("❌ Unauthenticated user on protected route => Redirecting to /auth/login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  console.log("✅ Passing request to next handler...");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/protected-route"],
};
