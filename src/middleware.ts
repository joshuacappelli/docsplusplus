import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware invoked");
  console.log(
    "NEXTAUTH_SECRET (length):",
    process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.length : "Not set"
  );

  // If the secret isn’t set in the environment, decide how to handle it:
  if (!process.env.NEXTAUTH_SECRET) {
    console.error("NEXTAUTH_SECRET is not set in the environment.");
    // You could throw an error or just let the request continue:
    return NextResponse.next();
  }

  try {
    // Debug: Inspect cookies
    console.log("Request:", request);
    console.log("Cookies available:", request.cookies.getAll());

    // Attempt to retrieve the *JWT* token (session.strategy = 'jwt' from NextAuth)
    console.log("Attempting to retrieve the token...");
    const token = await getToken({ req: request });

    if (token) {
      console.log("Token retrieved successfully:", token);
    } else {
      console.warn("No token found. Possibly user is unauthenticated or token is invalid.");
    }

    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);


    const url = request.nextUrl;
    console.log("URL:", url);
    // If user is already logged in (has a token) and tries to visit /auth/login
    // then redirect them to /dashboard
    if (token && url.pathname === "/auth/login") {
      console.log("Authenticated user on login page => redirecting to /dashboard.");
      return NextResponse.redirect(new URL("/dashboard", url.origin));
    }

    // If user is *not* logged in, block them from protected routes
    if (!token) {
      const protectedRoutes = ["/dashboard", "/protected-route"];
      const isProtected = protectedRoutes.some((route) =>
        url.pathname.startsWith(route)
      );

      if (isProtected) {
        console.log("Unauthenticated user on protected route => redirecting to /auth/login.");
        return NextResponse.redirect(new URL("/auth/login", url.origin));
      }
    }
  } catch (error) {
    console.error("Error during middleware execution:", error);
    // You can either just let the request continue or redirect to /auth/login:
    // return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If no redirects were triggered, just allow the request to continue
  return NextResponse.next();
}

// Specify which routes to protect via middleware
export const config = {
  matcher: ["/dashboard/:path*", "/protected-route"],
};
