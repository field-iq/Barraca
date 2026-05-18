import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const submitted = body.password as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || submitted !== adminPassword) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = await getSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}
