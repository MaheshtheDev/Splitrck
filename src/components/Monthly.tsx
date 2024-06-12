import {
  Bar,
  XAxis,
  YAxis,
  Text,
  ResponsiveContainer,
  Pie,
  Cell,
} from "recharts";
import dynamic from "next/dynamic";
import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

const BarChartWithoutSSR = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  {
    ssr: false,
  }
);

const PieChartWithoutSSR = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  {
    ssr: false,
  }
);

const checkIfStatsEmpty = (stats: any) => {
  if (!stats) {
    return true;
  }
  if (stats.lentByMeExpenses.length === 0 && stats.expenses.length === 0) {
    return true;
  }
  return false;
};

type Stats = {
  spentLentDetails: {
    name: string;
    value: number;
    fill: string;
  }[];
  topCategories: any[];
  dayWiseSplits: any[];
  catergoryWiseExpenses: any[];
  expenses: any[];
  lentByMeExpenses: any[];
  currency_code: "USD" | "INR";
};

export function MonthlyStats({ stats }: { stats: Stats }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const [activeTab, setActiveTab] = useState(0);

  const navLinks = [
    {
      name: "Spent",
    },
    {
      name: "Lent",
    },
    {
      name: "Categories",
    },
  ];

  return (
    <>
      {!checkIfStatsEmpty(stats) ? (
        <section className="my-2">
          <section className="flex gap-2">
            {stats.spentLentDetails.map((entry: any, index: number) => {
              const color =
                entry.name === "Spent" ? "text-red-500" : "text-[#4cb799]";
              return (
                <div
                  className="w-[49%] bg-[#f3f3f3] rounded-md py-1 px-2 flex justify-between items-center"
                  key={index}
                >
                  <div>
                    <p className="text-[10px] font-bold">{entry.name}</p>
                    <p className={`font-bold + ${color}`}>
                      {stats.currency_code === "INR"
                        ? "₹" + entry.value
                        : "$" + entry.value}
                    </p>
                  </div>
                  <div>
                    {entry.prevMonth === "up" ? (
                      <div className="items-center align-middle flex-col">
                        <TrendingUp className={`block m-auto + ${color}`} />
                        <p className="text-[8px]">
                          {entry.prevMonth} by {entry.prevMonthPercentage}%
                        </p>
                      </div>
                    ) : (
                      <div className="items-center flex-col justify-center align-middle">
                        <TrendingDown className={`block m-auto + ${color}`} />
                        <p className="text-[8px]">
                          {entry.prevMonth} by {entry.prevMonthPercentage}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
          <section className="my-2 flex justify-between">
            <div className="w-[49%] bg-[#f3f3f3] rounded-md py-1 px-2">
              <p className="text-green-900 text-sm">Top Categories</p>
              <ResponsiveContainer width="100%" height={40 * 3}>
                <PieChartWithoutSSR
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  width={400}
                  height={350}
                >
                  <Pie
                    data={stats.topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    valueKey="value"
                  >
                    {stats.topCategories.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChartWithoutSSR>
              </ResponsiveContainer>
              {stats.topCategories.map((d: any, i: any) => {
                return (
                  <div
                    key={i}
                    className="flex justify-between text-xs items-center"
                  >
                    <div className="flex justify-start items-center w-[56%]">
                      <div
                        className="w-2 h-2"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      ></div>
                      <p className="ml-1 truncate">{d.name}</p>
                    </div>
                    <p className="font-semibold w-[56%] flex justify-end">
                      {Number(d.value).toFixed(2)} {stats.currency_code}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="w-[49%]  bg-[#f3f3f3] rounded-md py-1 px-2">
              <p className=" text-sm">Days of Week</p>
              <ResponsiveContainer width="100%" height={40 * 4}>
                <BarChartWithoutSSR
                  data={stats.dayWiseSplits}
                  margin={{
                    top: 0,
                    right: 0,
                    left: -35,
                    bottom: 0,
                  }}
                  className="mt-2"
                  barSize={10}
                >
                  <XAxis
                    type="category"
                    dataKey={"name"}
                    padding={{ left: 5, right: 5 }}
                    style={{
                      fontSize: "8px",
                    }}
                  />
                  <YAxis
                    //orientation="right"
                    type="number"
                    dataKey="value"
                    axisLine={false}
                    //tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <Bar background dataKey="value" fillRule="evenodd">
                    {stats.dayWiseSplits.map((entry: any, index: number) => {
                      return <Cell key={`cell-${index}`} fill={entry.fill} />;
                    })}
                  </Bar>
                </BarChartWithoutSSR>
              </ResponsiveContainer>
            </div>
          </section>
          <section>
            <nav className="flex text-sm ">
              {navLinks.map((link, index) => {
                return (
                  <button
                    key={index}
                    className={
                      "px-1 pt-1 rounded-sm mx-1 first:ml-0 first:pl-0 " +
                      (activeTab === index
                        ? "underline underline-offset-4"
                        : "opacity-50 hover:opacity-100")
                    }
                    onClick={() => setActiveTab(index)}
                    data-umami-event={link.name + "Tab Clicks"}
                  >
                    {link.name}
                  </button>
                );
              })}
            </nav>
            <div>
              {
                {
                  0: (
                    <>
                      <p className="text-[9px] text-gray-600/90 opacity-65">
                        expenses you spent in the selected month
                      </p>
                      {stats.expenses.map((expense: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="flex justify-between bg-white py-1 items-center border-b-2 border-gray-100 hover:bg-gray-100 transition duration-300 ease-in-out pr-2 rounded-sm first:mt-2"
                          >
                            <div className="flex justify-start items-center">
                              <div className="bg-[#35335b] rounded-sm mr-2 px-2 py-1 text-white">
                                <div className="text-xs text-center">
                                  {new Date(expense.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                    }
                                  )}
                                </div>
                                <div className="text-md text-center">
                                  {new Date(expense.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      day: "numeric",
                                    }
                                  )}
                                </div>
                              </div>
                              <div className="items-center">
                                <p className="text-sm">{expense.description}</p>
                                <p className="text-[10px] text-[#cbaeae]">
                                  Paid by{" "}
                                  <span className="font-semibold capitalize">
                                    {expense.paidBy.user.first_name}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-[#F00] text-sm">
                              {Number(expense.amount).toFixed(2)}{" "}
                              {stats.currency_code}
                            </p>
                          </div>
                        );
                      })}
                    </>
                  ),
                  1: (
                    <>
                      <p className="text-[9px] text-gray-600/90 opacity-65">
                        expenses in which you lent money to your friends in the
                        selected month
                      </p>
                      {stats.lentByMeExpenses.map(
                        (expense: any, index: number) => {
                          return (
                            <div
                              key={index}
                              className="flex justify-between bg-white py-1 items-center border-b-2 border-gray-100 hover:bg-gray-100 transition duration-300 ease-in-out pr-2 rounded-sm first:mt-2"
                            >
                              <div className="flex justify-start items-center">
                                <div className="bg-[#35335b] rounded-sm mr-2 px-2 py-1 text-white">
                                  <div className="text-xs text-center">
                                    {new Date(expense.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                      }
                                    )}
                                  </div>
                                  <div className="text-md text-center">
                                    {new Date(expense.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        day: "numeric",
                                      }
                                    )}
                                  </div>
                                </div>
                                <div className="items-center">
                                  <p className="text-sm">
                                    {expense.description}
                                  </p>
                                  <p className="text-[10px] text-[#cbaeae]">
                                    Paid by{" "}
                                    <span className="font-semibold capitalize">
                                      {expense.paidBy.user.first_name}
                                    </span>{" "}
                                  </p>
                                </div>
                              </div>
                              <p className="font-semibold text-[#008000] text-sm">
                                {Number(expense.amount).toFixed(2)}{" "}
                                {stats.currency_code}
                              </p>
                            </div>
                          );
                        }
                      )}
                    </>
                  ),
                  2: stats.catergoryWiseExpenses.map(
                    (expense: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="flex justify-between bg-white py-1 items-center border-b-2 border-gray-100 hover:bg-gray-100 transition duration-300 ease-in-out pr-2 rounded-sm first:mt-2"
                        >
                          <div className="items-center">
                            <p className="text-sm">{expense.name}</p>
                            <p className="text-[10px] text-[#cbaeae]"></p>
                          </div>
                          <p className="font-semibold text-[#F00] text-sm">
                            {Number(expense.value).toFixed(2)}{" "}
                            {stats.currency_code}
                          </p>
                        </div>
                      );
                    }
                  ),
                }[activeTab]
              }
            </div>
          </section>
        </section>
      ) : (
        <div className="text-center mt-64 text-gray-500/55 text-sm">
          No data available for selected month
        </div>
      )}
    </>
  );
}
