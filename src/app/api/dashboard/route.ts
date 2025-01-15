import { NextResponse } from "next/server";
import { getDocumentsFromDb } from "@/db/queries";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
      });
      console.log("Token:", token);
      console.log("AUTH_SECRET:", process.env.AUTH_SECRET);
      console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await getDocumentsFromDb(parseInt(token.sub));
    return NextResponse.json({ success: true, data: documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch documents." },
      { status: 500 }
    );
  }
}



