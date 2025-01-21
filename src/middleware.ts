import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Middleware invoked");

  // OPTIONAL: Log the secret length to confirm it's being set
  console.log(
    "AUTH_SECRET (length):",
    process.env.AUTH_SECRET ? process.env.AUTH_SECRET.length : "Not set"
  );

  if (!process.env.AUTH_SECRET) {
    console.error("AUTH_SECRET is not set in the environment. Exiting middleware.");
    // You could throw an error or just proceed. 
    // For safety, we'll just let the request proceed, but you can modify as needed:
    return NextResponse.next();
  }

  try {
    // Log any cookies present (helpful for debugging)
    console.log("Cookies available:", req.cookies.getAll());

    // Attempt to retrieve the token from NextAuth
    console.log("Attempting to retrieve the token...");
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (token) {
      console.log("Token retrieved successfully:", token);
    } else {
      console.warn(
        "No token found. Possibly user is unauthenticated or token is invalid."
      );
    }

    // Handle request based on authentication status
    const url = req.nextUrl;

    // If the user is authenticated (token exists) and they hit /auth/login, redirect them
    if (token && url.pathname === "/auth/login") {
      console.log("Authenticated user on login page - redirecting to /dashboard.");
      return NextResponse.redirect(new URL("/dashboard", url.origin));
    }

    // If the user is not authenticated, block them from protected routes
    if (!token) {
      const protectedRoutes = ["/dashboard", "/protected-route"];
      const isProtectedRoute = protectedRoutes.some((route) =>
        url.pathname.startsWith(route)
      );

      if (isProtectedRoute) {
        console.log("Unauthenticated user on protected route - redirecting to /auth/login.");
        return NextResponse.redirect(new URL("/auth/login", url.origin));
      }
    }
  } catch (error) {
    console.error("Error during middleware execution:", error);
    // Fallback if token retrieval fails
    // Decide whether to let the request proceed or to redirect:
    // return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If no redirect is triggered, proceed with the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/protected-route"],
};
