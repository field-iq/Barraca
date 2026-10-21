import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  passwordMatches,
} from "@/lib/adminAuth";
import { checkRateLimit, clientKey } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  if (!checkRateLimit(`admin-login:${clientKey(request)}`, 10, 15 * 60_000)) {
    return NextResponse.json({ error: "Demasiados intentos. Probá de nuevo en unos minutos." }, { status: 429 });
  }

  let submitted: unknown;
  try {
    submitted = ((await request.json()) as { password?: unknown }).password;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const token = await createSessionToken();
  if (!token || !(await passwordMatches(submitted, process.env.ADMIN_PASSWORD))) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return response;
}
