import { auth } from "@/lib/auth";
import { CustomSession } from "@/lib/auth.config";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = await auth();
  const token =
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value ??
    req.cookies.get("authjs.session-token")?.value ??
    req.headers.get("Authorization")?.replace("Bearer ", "");

  //console.log("token ", token);

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const { user } = await fetch(
    "https://secure.splitwise.com/api/v3.0/get_current_user",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
      cache: "no-cache",
    }
  ).then((res) => res.json());

  console.log("user ", user)

  return NextResponse.json(
    { user },
    {
      status: 200,
    }
  );
}
