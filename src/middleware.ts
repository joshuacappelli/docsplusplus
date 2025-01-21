import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Middleware invoked"); // Debug start point

  const secret = process.env.AUTH_SECRET;
  console.log("AUTH_SECRET:", secret ? "Set" : "Not set");

  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }

  try {
    // Attempt to retrieve the token
    const token = await getToken({ req, secret });

    // Log the entire request headers to understand context
    console.log("Request Headers:", JSON.stringify(req.headers, null, 2));

    // Specific logging for cookies
    console.log("Cookies:", req.cookies.getAll());

    // Log the token result
    if (token) {
      console.log("Token retrieved successfully:", JSON.stringify(token, null, 2));
    } else {
      console.log("No token found. User might be unauthenticated or token is invalid.");
    }

    const url = req.nextUrl;
    console.log("Request URL:", url.toString());
    console.log("Pathname:", url.pathname);

    if (token) {
      console.log("User is authenticated");
      // Redirect logged-in users away from the login page
      if (url.pathname === "/auth/login") {
        console.log("Redirecting to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", url.origin));
      }
    } else {
      console.log("User is not authenticated");
      // Redirect unauthenticated users to the login page for protected routes
      const protectedRoutes = ["/dashboard", "/protected-route"];
      const isProtectedRoute = protectedRoutes.some((route) =>
        url.pathname.startsWith(route)
      );
      console.log("Is protected route:", isProtectedRoute);

      if (isProtectedRoute) {
        console.log("Redirecting to /auth/login");
        return NextResponse.redirect(new URL("/auth/login", url.origin));
      }
    }
  } catch (error) {
    console.error("Error retrieving token or during middleware execution:", error);
  }

  console.log("No redirection, proceeding to next middleware or handler");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/protected-route"],
};
