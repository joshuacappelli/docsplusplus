import { createUserInDb } from "@/db/queries";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    await createUserInDb(email, password);
    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    console.error('Signup error:', err.message);
    console.error(err.stack);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
} 