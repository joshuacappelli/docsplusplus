import { handlers } from "@/auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from 'next/server';

// Add middleware to check authentication
export async function middleware(req: NextRequest) {
    const token = await getToken({ 
        req,
        secret: process.env.AUTH_SECRET
    });
  
    const url = new URL(req.url);
    const pathname = url.pathname;
  
    if (token) {
      // If user is logged in and trying to access the login page, redirect to dashboard
      if (pathname === "/auth/login") {
        return NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL || "http://localhost:3000"));
      }
    } else {
      // If user is not logged in and trying to access protected routes, redirect to login
      const protectedRoutes = ["/dashboard", "/protected-route"];
      if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/auth/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
      }
    }
  
    return NextResponse.next();
  }

// Configure which routes should be protected
export const config = {
    matcher: ["/auth/login", "/dashboard", "/protected-route"],
  };
