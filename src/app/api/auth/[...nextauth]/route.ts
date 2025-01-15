import { handlers } from "@/auth";
import { NextResponse } from "next/server";
import  getServerSession  from "next-auth"; // Correct import
import { authOptions } from "@/auth";

// Export the basic auth handlers
export const { GET, POST } = handlers;

// Add middleware to check authentication
export async function middleware(_req: any) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', process.env.NEXTAUTH_URL));
  }

  return NextResponse.next();
}

// Configure which routes should be protected
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|login|signup|favicon.ico).*)'],
};
