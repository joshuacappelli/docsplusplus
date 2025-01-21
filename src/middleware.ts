import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  console.log("AUTH_SECRET:", process.env.AUTH_SECRET);
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
  console.log("TURSO_URL:", process.env.TURSO_URL);
  console.log("TURSO_AUTH_TOKEN:", process.env.TURSO_AUTH_TOKEN);
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }

  const token = await getToken({ req, secret }); // Pass the secret explicitly

  const url = req.nextUrl;

  if (token) {
    // Redirect logged-in users away from the login page
    if (url.pathname === "/auth/login") {
      return NextResponse.redirect(new URL("/dashboard", url.origin));
    }
  } else {
    // Redirect unauthenticated users to the login page for protected routes
    const protectedRoutes = ["/dashboard", "/protected-route"];
    if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/auth/login", url.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/dashboard/:path*", "/protected-route"],
};
