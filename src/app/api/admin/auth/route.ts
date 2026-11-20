import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password;
    const correctPassword = process.env.ADMIN_PASSWORD || "Zxcvbnm@12345";

    if (password === correctPassword) {
      const response = NextResponse.json({ ok: true });
      response.cookies.set("admin_token", correctPassword, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json({ ok: false, error: "invalid_password" }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
