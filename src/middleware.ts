import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  console.log("Middleware invoked");

  const secret = process.env.AUTH_SECRET;
  console.log("AUTH_SECRET:", secret ? "Set" : "Not set");

  if (!secret) {
    console.error("AUTH_SECRET is not set in the environment. Exiting middleware.");
    throw new Error("AUTH_SECRET is not set");
  }

  try {
    // Log and inspect cookies
    const cookies = req.cookies.getAll();
    console.log("Cookies available:", cookies);

    // Extract and log the session token for inspection
    const sessionToken = cookies.find(
      (cookie) => cookie.name === "__Secure-authjs.session-token"
    );
    if (sessionToken) {
      console.log("__Secure-authjs.session-token found:", sessionToken.value);

      // Decode the session token using jwt to inspect its structure
      try {
        const decodedToken = jwt.decode(sessionToken.value);
        console.log("Decoded session token:", JSON.stringify(decodedToken, null, 2));
      } catch (decodeError) {
        console.error("Error decoding __Secure-authjs.session-token:", decodeError);
      }
    } else {
      console.warn("__Secure-authjs.session-token not found in cookies.");
    }

    // Attempt to retrieve the token using getToken
    console.log("Attempting to retrieve the token...");
    const token = await getToken({ req, secret });

    if (token) {
      console.log("Token retrieved successfully:", JSON.stringify(token, null, 2));
    } else {
      console.warn("No token found. This might indicate the user is unauthenticated or the token is invalid.");
    }

    // Handle request based on authentication status
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
    console.error("Error during middleware execution:", error);
    console.error("Possible issues could be:");
    console.error("- Invalid or mismatched AUTH_SECRET.");
    console.error("- Token is malformed or expired.");
    console.error("- Missing or incorrect cookie configuration.");
  }

  console.log("No redirection required. Proceeding to the next middleware or handler.");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/protected-route"],
};
