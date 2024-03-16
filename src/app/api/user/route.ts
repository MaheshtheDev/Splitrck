import { getServerSession } from "next-auth/next";
import { CustomSession, authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
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
        Authorization: "Bearer " + (session as CustomSession).accessToken,
      },
      cache: "no-cache",
    }
  ).then((res) => res.json());

  return NextResponse.json(
    { user },
    {
      status: 200,
    }
  );
}
