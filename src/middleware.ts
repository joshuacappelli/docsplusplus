import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Basic debug logs
  console.log("=== Middleware invoked ===");
  console.log("NODE_ENV:", process.env.NODE_ENV);

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
    // Debug: Inspect the request itself
    console.log("Request Information:");
    console.log("• Method:", request.method);
    console.log("• URL:", request.url);
    console.log("• Headers:", JSON.stringify([...request.headers], null, 2));
    console.log("• Cookies:", request.cookies.getAll());
    console.log("• nextUrl:", JSON.stringify(request.nextUrl, null, 2));

    // Attempt to retrieve the *JWT* token (session.strategy = 'jwt' in NextAuth config)
    console.log("Attempting to retrieve the token...");
    console.log("secret", process.env.NEXTAUTH_SECRET);
    // You can pass `secret: process.env.NEXTAUTH_SECRET` if you want to be explicit:
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (!token) {
      console.warn("Token missing or invalid:", request.cookies.getAll());
    }
    
    if (token) {
      console.log("Token retrieved successfully:", token);
    } else {
      console.warn("No token found. Possibly user is unauthenticated or token is invalid.");
    }

    // Log your NextAuth URL environment variable
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

    // Handle logic
    const url = request.nextUrl;
    console.log("URL object:", url);

    if (token && url.pathname === "/auth/login") {
      console.log("Authenticated user on login page => redirecting to /dashboard.");
      return NextResponse.redirect(new URL("/dashboard", url.origin));
    }

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
    // Decide whether to let the request continue or to redirect:
    // return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If no redirects were triggered, just allow the request to continue
  console.log("No redirect triggered. Passing to next handler...");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/protected-route"],
};
