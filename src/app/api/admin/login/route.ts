import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Keysersoz3";

    if (password === ADMIN_PASSWORD) {
      const sessionToken = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest("hex");
      
      const response = NextResponse.json({ success: true });
      
      response.cookies.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week session
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Incorrect password" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
