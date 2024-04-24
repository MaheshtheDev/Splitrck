import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export default auth((req) => {
    if (!req.auth) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
