import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Tell the root layout which document language to render.
  if (pathname === "/bn" || pathname.startsWith("/bn/")) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-locale", "bn")
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next()
  }

  // The protected server layout and every mutation perform authoritative verification.
  if (!request.cookies.has("portfolio_admin_session")) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = { matcher: ["/admin/:path*", "/bn", "/bn/:path*"] }
