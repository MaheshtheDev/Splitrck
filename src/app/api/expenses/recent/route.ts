import { getServerSession } from "next-auth/next";
import { CustomSession, authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  const params = new URLSearchParams(request.url.split("?")[1]);
  const userId = params.get("userId");
  console.log(userId);

  // recent first date is 30 days ago
  const recentFirstDate = new Date();
  recentFirstDate.setDate(recentFirstDate.getDate() - 30);

  const { expenses } = await fetch(
    `https://secure.splitwise.com/api/v3.0/get_expenses?dated_after=${recentFirstDate.toISOString()}?limit=50`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + (session as CustomSession).accessToken,
      },
      cache: "no-cache",
    }
  ).then((res) => res.json());

  // filter out the expenses that only current user is involved
  const filteredExpenses = expenses.filter((expense: any) => {
    return expense.users.some(
      (user: any) => user.user_id.toString() === userId
    );
  });

  return NextResponse.json(
    { filteredExpenses },
    {
      status: 200,
    }
  );
}
