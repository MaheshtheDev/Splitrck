import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// middleware is applied to all routes, use conditionals to select

export default withAuth(
  function middleware(req) {
    const session = req.nextauth.token;
    if (!session) {
      return NextResponse.rewrite(new URL("/", req.url));
    }

    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    if (!isOnDashboard) {
      return NextResponse.rewrite(new URL("/dashboard", req.url));
    }
  },
  {
    pages: {
      signIn: "/",
    },
  }
);

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
