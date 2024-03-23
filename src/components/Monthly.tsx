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
import { HandCoins } from "lucide-react";

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

export function MonthlyStats({ stats }: { stats: any }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const YAxisLeftTick = ({ y, payload: { value } }: any) => {
    const valueFoo = stats.spentLentDetails.find((d: any) => d.name === value);
    return (
      <g>
        <Text
          x={0}
          y={y - 10}
          textAnchor="start"
          verticalAnchor="middle"
          fontSize={10}
          fontWeight="bold"
        >
          {value}
        </Text>
        <Text
          x={0}
          y={y + 5}
          textAnchor="start"
          verticalAnchor="middle"
          fontSize={16}
          fontWeight="bold"
          className={
            "tracking-wide" + (value === "Spent" ? " text-red-500" : "")
          }
          fill={value === "Spent" ? "red" : "green"}
        >
          {"$" + valueFoo?.value}
        </Text>
      </g>
    );
  };

  return (
    <>
      <section className="my-2">
        <div className="">
          <ResponsiveContainer
            width={"100%"}
            height={50 * stats.spentLentDetails.length}
            debounce={50}
          >
            <BarChartWithoutSSR
              data={stats.spentLentDetails}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              className="mt-2"
            >
              <XAxis type="number" hide />
              <YAxis
                yAxisId={0}
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={<YAxisLeftTick />}
              />
              <Bar background dataKey="value" radius={5} fillRule="evenodd">
                {stats.spentLentDetails.map((entry: any, index: number) => {
                  return <Cell key={`cell-${index}`} fill={entry.fill} />;
                })}
              </Bar>
            </BarChartWithoutSSR>
          </ResponsiveContainer>
        </div>
        <section className="my-2 flex justify-between">
          <div className="w-[47%] bg-[#f3f3f3] rounded-md py-1 px-2">
            <p className="text-green-900 text-center">Top Categories</p>
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
                  <div className="flex justify-center items-center">
                    <div
                      className="w-2 h-2"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    ></div>
                    <p className="ml-1 truncate">{d.name}</p>
                  </div>
                  <p className="font-semibold">{d.value} USD</p>
                </div>
              );
            })}
          </div>
          <div className="w-[47%]  bg-[#699cb1] rounded-md py-1 px-2">
            <p className="text-center">Weekly</p>
          </div>
        </section>
        <section>
          <nav className="flex justify-start text-sm">
            <a className="mr-2 underline underline-offset-4">Transactions</a>
            <a>Categories</a>
          </nav>
          <div>
            {stats.expenses.map((expense: any, index: number) => {
              return (
                <div
                  key={index}
                  className="flex justify-between bg-white py-1 items-center border-b-2 border-gray-100 hover:bg-gray-100 transition duration-300 ease-in-out pr-2 rounded-sm first:mt-2"
                >
                  <div className="flex justify-start items-center">
                    <div className="bg-[#35335b] rounded-sm mr-2 px-2 py-1 text-white">
                      <div className="text-xs text-center">
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </div>
                      <div className="text-md text-center">
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm">{expense.description}</p>
                      <div className="flex items-center mt-1">
                        <div className="rounded-full bg-[#f3f3f3] px-2 flex items-center mr-1">
                          <HandCoins size={10} />
                          <p className="text-[10px] ml-1">
                            {expense.paidBy.user.first_name}
                          </p>
                        </div>
                        <div className="rounded-full bg-[#f3f3f3] px-2">
                          <div className="text-[10px] text-center">
                            {expense.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {Number(expense.amount).toFixed(2)} USD
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </>
  );
}
