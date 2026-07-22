import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isApi = req.nextUrl.pathname.startsWith("/api/");
  const isProtectedApi =
    isApi &&
    (req.nextUrl.pathname.startsWith("/api/objectifs") ||
      req.nextUrl.pathname.startsWith("/api/indicateurs") ||
      req.nextUrl.pathname.startsWith("/api/export"));

  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/join", req.url));
  }

  if (isProtectedApi && !session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/objectifs/:path*", "/api/indicateurs/:path*", "/api/export/:path*"],
};
