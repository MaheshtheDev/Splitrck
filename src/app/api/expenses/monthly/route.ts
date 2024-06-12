import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { CustomSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

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

  const prevMonthStart = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() - 1,
    1
  );

  const prevMonthEnd = new Date(
    prevMonthStart.getFullYear(),
    prevMonthStart.getMonth() + 1,
    0
  );

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

  function generateStats(expenses: any, prevMonthStatsData: any) {
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
          prevMonth: prevMonthStatsData.lentByMe > lentByMe ? "down" : "up",
          prevMonthPercentage: Number(
            Math.abs((lentByMe - prevMonthStatsData.lentByMe) / prevMonthStatsData.lentByMe)
          ).toFixed(2),
        },
        {
          name: "Spent",
          value: Number(spentByMe).toFixed(2),
          fill: "red",
          prevMonth: prevMonthStatsData.spentByMe > spentByMe ? "down" : "up",
          prevMonthPercentage: Number(
            Math.abs((spentByMe -
              prevMonthStatsData.spentByMe) / prevMonthStatsData.spentByMe)
          ).toFixed(2),
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

  async function prevMonthStats() {
    let API_URL = `https://secure.splitwise.com/api/v3.0/get_expenses?dated_after=${prevMonthStart
      .toISOString()
      .slice(0, 10)}&dated_before=${prevMonthEnd
      .toISOString()
      .slice(0, 10)}&limit=50000`;

    const { expenses } = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + (session as CustomSession).accessToken,
      },
      cache: "no-cache",
    }).then((res) => res.json());

    const USDExpenses = expenses.filter(
      (expse: any) =>
        (expse.creation_method === null || expse.creation_method === "equal") &&
        expse.currency_code === "USD" &&
        expse.deleted_at === null
    );

    const INRExpenses = expenses.filter(
      (expse: any) =>
        (expse.creation_method === null || expse.creation_method === "equal") &&
        expse.currency_code === "INR" &&
        expse.deleted_at === null
    );

    let spentByMe = 0;
    let lentByMe = 0;

    if (USDExpenses.length > 0) {
      USDExpenses.forEach((expense: any) => {
        const userExpenseInfo = expense.users.find(
          (user: any) => user.user_id === Number(userId)
        );

        if (userExpenseInfo) {
          if (userExpenseInfo.paid_share != 0) {
            lentByMe += userExpenseInfo.paid_share - userExpenseInfo.owed_share;
          }

          if (userExpenseInfo.owed_share > 0) {
            spentByMe += parseFloat(userExpenseInfo.owed_share || 0);
          }
        }
      });
    } else if (INRExpenses.length > 0) {
      INRExpenses.forEach((expense: any) => {
        const userExpenseInfo = expense.users.find(
          (user: any) => user.user_id === Number(userId)
        );

        if (userExpenseInfo) {
          if (userExpenseInfo.paid_share != 0) {
            lentByMe += userExpenseInfo.paid_share - userExpenseInfo.owed_share;
          }

          if (userExpenseInfo.owed_share > 0) {
            spentByMe += parseFloat(userExpenseInfo.owed_share || 0);
          }
        }
      });
    }

    return {
      spentByMe: spentByMe,
      lentByMe: lentByMe,
    };
  }

  const USDExpenses = expenses.filter(
    (expse: any) =>
      (expse.creation_method === null || expse.creation_method === "equal") &&
      expse.currency_code === "USD" &&
      expse.deleted_at === null
  );

  const INRExpenses = expenses.filter(
    (expse: any) =>
      (expse.creation_method === null || expse.creation_method === "equal") &&
      expse.currency_code === "INR" &&
      expse.deleted_at === null
  );

  const prevMonthStatsData = await prevMonthStats();

  if (USDExpenses.length > 0) {
    const USDStats = generateStats(USDExpenses, prevMonthStatsData);
    return NextResponse.json(
      { ...USDStats, currency_code: "USD" },
      {
        status: 200,
      }
    );
  } else if (INRExpenses.length > 0) {
    const INRStats = generateStats(INRExpenses, prevMonthStatsData);
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
            prevMonth: "down",
            prevMonthPercentage: 0,
          },
          {
            name: "Spent",
            value: 0,
            fill: "red",
            prevMonth: "down",
            prevMonthPercentage: 0,
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
