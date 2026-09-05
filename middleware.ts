import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionToken } from "@/lib/adminAuth";

const HAS_EXTENSION = /\.[^/]+$/;

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

  // Public pages live under app/[locale]/*. English URLs already carry the
  // "/en" segment the file structure expects, so they pass straight through.
  // Spanish is the default and stays unprefixed in the address bar, so it's
  // rewritten internally to the "/es" segment that actually renders it.
  // Doing this as a route param (rather than a header the root layout reads)
  // matters: Next.js only re-renders a layout on client-side navigation when
  // one of its own route params changes, so the language has to live in the
  // URL structure, not in a header a persistent layout reads once.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/es${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
