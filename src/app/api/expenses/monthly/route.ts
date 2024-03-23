import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { CustomSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  const params = new URLSearchParams(request.url.split("?")[1]);
  const userId = params.get("userId");
  const date: any = params.get("date");
  const startOfMonth = new Date(date);
  startOfMonth.setDate(1);
  const endOfMonth = new Date(
    startOfMonth.getFullYear(),
    startOfMonth.getMonth() + 1,
    0
  );

  // recent first date is 30 days ago
  const recentFirstDate = new Date();
  recentFirstDate.setDate(recentFirstDate.getDate() - 30);

  let API_URL = `https://secure.splitwise.com/api/v3.0/get_expenses?dated_after=${startOfMonth
    .toISOString()
    .slice(0, 10)}&dated_before=${endOfMonth
    .toISOString()
    .slice(0, 10)}&limit=50000`;

  const { expenses } = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + (session as CustomSession).accessToken,
    },
    cache: "no-cache",
  }).then((res) => res.json());

  function generateStats(expenses: any) {
    let spentByMe = 0;
    let lentByMe = 0;
    let sortedExpenses: any = [];
    let categoryWiseExpenses: any = [];

    expenses.forEach((expense: any) => {
      if (expense.deleted_at) {
        return;
      }

      const userExpenseInfo = expense.users.find(
        (user: any) => user.user_id === Number(userId)
      );

      if (userExpenseInfo) {
        if (userExpenseInfo.paid_share != 0) {
          lentByMe += userExpenseInfo.paid_share - userExpenseInfo.owed_share;
        }

        if (userExpenseInfo.owed_share > 0) {
          spentByMe += parseFloat(userExpenseInfo.owed_share || 0);
          // add to category wise expenses
          if (
            categoryWiseExpenses.find(
              (category: any) => category.name === expense.category.name
            )
          ) {
            const categoryIndex = categoryWiseExpenses.findIndex(
              (category: any) => category.name === expense.category.name
            );
            categoryWiseExpenses[categoryIndex].value =
              Number(categoryWiseExpenses[categoryIndex].value) +
              Number(parseFloat(userExpenseInfo.owed_share || 0));
          } else {
            categoryWiseExpenses.push({
              name: expense.category.name,
              value: parseFloat(userExpenseInfo.owed_share || 0),
            });
          }
          sortedExpenses.push({
            description: expense.description,
            amount: parseFloat(userExpenseInfo.owed_share || 0),
            date: expense.date,
            category: expense.category.name,
          } as any);
        }
      }
    });

    categoryWiseExpenses = categoryWiseExpenses.map((category: any) => {
      return {
        name: category.name,
        value: Number(Number(category.value).toFixed(2)),
      };
    });

    return {
      spentLentDetails: [
        {
          name: "Lent",
          value: Number(lentByMe).toFixed(2),
          fill: "green",
        },
        {
          name: "Spent",
          value: Number(spentByMe).toFixed(2),
          fill: "red",
        },
      ],
      topCategories: categoryWiseExpenses
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3),
      expenses: sortedExpenses,
    };
  }

  const filteredExpenses = expenses.filter(
    (expse: any) =>
      expse.creation_method === null &&
      expse.currency_code === "USD" &&
      expse.deleted_at === null
  );

  const stats = generateStats(filteredExpenses);

  return NextResponse.json(stats, {
    status: 200,
  });
}
