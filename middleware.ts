import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionToken } from "@/lib/adminAuth";

const HAS_EXTENSION = /\.[^/]+$/;
const LOCALE_HEADER = "x-app-locale";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (pathname === "/admin/login" || pathname === "/api/admin/auth") {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("admin_session");
    const expectedToken = await getSessionToken();

    if (!sessionCookie || sessionCookie.value !== expectedToken) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api") || HAS_EXTENSION.test(pathname)) {
    return NextResponse.next();
  }

  // English pages live at "/en" and "/en/*" in the URL, but are served by the
  // same routes as the (default, unprefixed) Spanish site — rewrite the
  // prefix away internally while keeping it visible in the address bar, and
  // flag the request so the root layout can pick the right initial language.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, "en");

    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, "es");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
