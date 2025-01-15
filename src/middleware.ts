import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    const url = new URL(req.url);
    const pathname = url.pathname;

    if (token) {
      // Redirect logged-in users away from the login page
      if (pathname === "/auth/login") {
        return NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL || "http://localhost:3000"));
      }
    } else {
      // Redirect unauthenticated users from protected routes to login
      const protectedRoutes = ["/dashboard", "/protected-route"];
      if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/auth/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.json(
      { error: "Internal Server Error in Middleware" },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/auth/login", "/dashboard", "/protected-route"],
};
