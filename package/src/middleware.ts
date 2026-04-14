import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                         req.nextUrl.pathname.startsWith('/menu-processor') || 
                         req.nextUrl.pathname.startsWith('/flash-sale') ||
                         req.nextUrl.pathname.startsWith('/orders') ||
                         req.nextUrl.pathname.startsWith('/catalog')
    
    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = { matcher: ["/dashboard/:path*", "/menu-processor/:path*", "/flash-sale/:path*", "/orders/:path*", "/catalog/:path*"] }
