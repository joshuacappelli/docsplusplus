import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Middleware invoked");

  const secret = process.env.AUTH_SECRET;
  console.log("AUTH_SECRET:", secret ? "Set" : "Not set");

  if (!secret) {
    console.error("AUTH_SECRET is not set in the environment. Exiting middleware.");
    throw new Error("AUTH_SECRET is not set");
  }

  // Log the request headers
  console.log("Request Headers:", JSON.stringify(req.headers, null, 2));

  // Log all cookies in the request
  const cookies = req.cookies.getAll();
  console.log("Cookies:", cookies);

  // Attempt to retrieve the token
  try {
    console.log("Attempting to retrieve the token...");
    const token = await getToken({ req, secret });

    if (token) {
      console.log("Token retrieved successfully:", JSON.stringify(token, null, 2));
    } else {
      console.warn("No token found. This might indicate the user is unauthenticated or the token is invalid.");
    }

    // Log request details
    const url = req.nextUrl;
    console.log("Request URL:", url.toString());
    console.log("Pathname:", url.pathname);

    if (token) {
      console.log("User is authenticated. Proceeding based on pathname...");
      if (url.pathname === "/auth/login") {
        console.log("Redirecting authenticated user away from login page to /dashboard.");
        return NextResponse.redirect(new URL("/dashboard", url.origin));
      }
    } else {
      console.log("User is not authenticated. Checking for protected routes...");
      const protectedRoutes = ["/dashboard", "/protected-route"];
      const isProtectedRoute = protectedRoutes.some((route) =>
        url.pathname.startsWith(route)
      );
      console.log("Is protected route:", isProtectedRoute);

      if (isProtectedRoute) {
        console.log("Redirecting unauthenticated user to /auth/login.");
        return NextResponse.redirect(new URL("/auth/login", url.origin));
      }
    }
  } catch (error) {
    console.error("Error occurred during token retrieval or middleware execution:", error);
  }

  console.log("No redirection required. Proceeding to the next middleware or handler.");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/protected-route"],
};
