
import { auth } from "@/lib/auth";
import { CustomSession } from "@/lib/auth.config";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const session = await auth();

  const params = new URLSearchParams(request.url.split("?")[1]);
  const userId = params.get("userId");
  const date: any = params.get("date");
  const selectedDate = new Date(date);
  const startOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );
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
    let lentByMeExpenses: any = [];
    let categoryWiseExpenses: any = [];
    let dayWiseSplits: any = [
      {
        name: "Sun",
        value: 0,
      },
      {
        name: "Mon",
        value: 0,
      },
      {
        name: "Tue",
        value: 0,
      },
      {
        name: "Wed",
        value: 0,
      },
      {
        name: "Thu",
        value: 0,
      },
      {
        name: "Fri",
        value: 0,
      },
      {
        name: "Sat",
        value: 0,
      },
    ];

    expenses.forEach((expense: any) => {
      if (expense.deleted_at) {
        return;
      }

      const userExpenseInfo = expense.users.find(
        (user: any) => user.user_id === Number(userId)
      );

      const paidBy = expense.users.find(
        (user: any) => Number(user.paid_share) !== 0
      );

      if (userExpenseInfo) {
        if (userExpenseInfo.paid_share != 0) {
          lentByMe += userExpenseInfo.paid_share - userExpenseInfo.owed_share;
          lentByMeExpenses.push({
            description: expense.description,
            amount: userExpenseInfo.paid_share - userExpenseInfo.owed_share,
            date: expense.date,
            category: expense.category.name,
            paidBy: paidBy,
          } as any);
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

          // add to day wise splits
          const day = new Date(expense.date).getDay();
          dayWiseSplits[day].value =
            dayWiseSplits[day].value + parseFloat(userExpenseInfo.owed_share);

          sortedExpenses.push({
            description: expense.description,
            amount: parseFloat(userExpenseInfo.owed_share || 0),
            date: expense.date,
            category: expense.category.name,
            paidBy: paidBy,
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
      dayWiseSplits: dayWiseSplits.map((day: any) => {
        return {
          name: day.name,
          value: Number(Number(day.value).toFixed(2)),
        };
      }),
      catergoryWiseExpenses: categoryWiseExpenses,
      expenses: sortedExpenses.sort((a: any, b: any) => b.amount - a.amount),
      lentByMeExpenses: lentByMeExpenses.sort(
        (a: any, b: any) => b.amount - a.amount
      ),
    };
  }

  const USDExpenses = expenses.filter(
    (expse: any) => ((expse.creation_method === null || expse.creation_method === "equal") && expse.currency_code === "USD" && expse.deleted_at === null)
  );

  const INRExpenses = expenses.filter(
    (expse: any) => ((expse.creation_method === null || expse.creation_method === "equal") && expse.currency_code === "INR" && expse.deleted_at === null)
  );

  if (USDExpenses.length > 0) {
    const USDStats = generateStats(USDExpenses);
    return NextResponse.json(
      { ...USDStats, currency_code: "USD" },
      {
        status: 200,
      }
    );
  } else if (INRExpenses.length > 0) {
    const INRStats = generateStats(INRExpenses);
    return NextResponse.json(
      { ...INRStats, currency_code: "INR" },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      {
        spentLentDetails: [
          {
            name: "Lent",
            value: 0,
            fill: "green",
          },
          {
            name: "Spent",
            value: 0,
            fill: "red",
          },
        ],
        topCategories: [],
        dayWiseSplits: [],
        catergoryWiseExpenses: [],
        expenses: [],
        lentByMeExpenses: [],
        currency_code: "USD",
      },
      {
        status: 200,
      }
    );
  }
}
