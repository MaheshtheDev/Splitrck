import { auth } from "@/lib/auth";
import { CustomSession } from "@/lib/auth.config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  const params = new URLSearchParams(request.url.split("?")[1]);
  const userId = params.get("userId");

  // recent first date is 30 days ago
  const recentFirstDate = new Date();
  recentFirstDate.setDate(recentFirstDate.getDate() - 30);

  const { friends } = await fetch(
    `https://secure.splitwise.com/api/v3.0/get_friends`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + (session as CustomSession).accessToken,
      },
      cache: "no-cache",
    }
  ).then((res) => res.json());

  const owedByMe: {
    friend: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
    amount: number;
  } = {
    friend: {
      id: -1,
      first_name: "",
      last_name: "",
      email: "",
    },
    amount: 0,
  };

  const owedToMe: {
    friend: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
    amount: number;
  } = {
    friend: {
      id: 0,
      first_name: "",
      last_name: "",
      email: "",
    },
    amount: 0,
  };

  friends.forEach((friend: any) => {
    let friendBalance: number = 0;
    friend.balance.forEach((balance: any) => {
      friendBalance += Number(balance.amount);
    });

    if (owedToMe.amount < friendBalance) {
      owedToMe.amount = friendBalance;
      owedToMe.friend = friend;
    } else if (friendBalance < 0 && owedByMe.amount > friendBalance) {
      owedByMe.amount = friendBalance;
      owedByMe.friend = friend;
    }
  });

  let currentDate = new Date();
  let fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(currentDate.getMonth() - 3);
  fourMonthsAgo.setDate(1);
  let API_URL = `https://secure.splitwise.com/api/v3.0/get_expenses?dated_after=${fourMonthsAgo
    .toISOString()
    .slice(0, 10)}&limit=50000`;

  const expensesData = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + (session as CustomSession).accessToken,
    },
    cache: "no-cache",
  }).then((res) => res.json());

  function calculateMonthWiseSplits(expensesData: any, userId: any) {
    const monthWiseSplits: {
      [month: string]: { owed: number; received: number; expenses: any[] };
    } = {};

    expensesData.expenses
      .filter(
        (expse: any) =>
          expse.creation_method === null &&
          expse.currency_code === "USD" &&
          expse.deleted_at === null
      )
      .forEach((expense: any) => {
        const date = new Date(expense.date);
        const date_month = date.toLocaleString("en-US", { month: "short" });
        const date_year = date.toLocaleString("en-US", { year: "2-digit" });
        const month = `${date_month}'${date_year}`;

        const userExpenseInfo = expense.users.find(
          (user: any) => user.user_id === Number(userId)
        );

        if (userExpenseInfo) {
          if (!monthWiseSplits[month]) {
            monthWiseSplits[month] = { owed: 0, received: 0, expenses: [] };
          }

          //handle the currency convertor
          const amount = parseFloat(userExpenseInfo.owed_share || "0");

          if (amount > 0) {
            monthWiseSplits[month].owed += amount;
            // add expenses to the month
            monthWiseSplits[month].expenses.push({
              description: expense.description,
              amount: amount,
              date: expense.date,
            });
          }
        }
      });

    return monthWiseSplits;
  }

  const mSplits = calculateMonthWiseSplits(expensesData, userId);

  let monthWiseSplits = Object.keys(mSplits).map((month) => {
    return {
      month,
      owed: mSplits[month].owed,
      expenses: mSplits[month].expenses,
    };
  });

  return NextResponse.json(
    {
      owedByMe: {
        friend: owedByMe.friend,
        amount: owedByMe.amount * -1,
      },
      owedToMe: {
        friend: owedToMe.friend,
        amount: owedToMe.amount,
      },
      monthWiseSplits,
    },
    {
      status: 200,
    }
  );
}
