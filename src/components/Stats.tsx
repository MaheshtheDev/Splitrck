import { useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  CartesianGrid,
  LabelList,
  Legend,
  Cell,
} from "recharts";

type StatsProps = {
  user: any;
  stats: {
    owedByMe: { friend: any; amount: number };
    owedToMe: { friend: any; amount: number };
    monthWiseSplits: any;
  } | null;
};

const renderCustomizedLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  const radius = 10;

  // Round value to two decimal places
  const roundedValue = Number(value).toFixed(2);

  return (
    <g>
      <rect
        x={x}
        y={y - radius - 12}
        width={width}
        height={radius * 2}
        fill="#ffff"
      />
      <text
        x={x + width / 2}
        y={y - radius}
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
      >
        ${roundedValue}
      </text>
    </g>
  );
};

export function Stats({ user, stats }: StatsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <>
      {stats && stats.monthWiseSplits && (
        <>
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="bg-green-700 text-white rounded-lg py-1 px-2">
              <p className="text-sm">
                {stats.owedToMe.friend.first_name} owes you
              </p>
              <p className="font-semibold">{stats.owedToMe.amount} USD</p>
            </div>
            <div className="bg-red-700 text-white rounded-lg py-1 px-2">
              <p className="text-sm">
                you owe {stats.owedByMe.friend.first_name}
              </p>
              <p className="font-semibold">{stats.owedByMe.amount} USD</p>
            </div>
          </div>
          <div className="my-4">
            <h2 className="text-md font-medium text-green-900">Monthly</h2>
            <BarChart
              width={375}
              height={300}
              data={stats.monthWiseSplits}
              maxBarSize={40}
            >
              <CartesianGrid strokeDasharray="10 10" />
              <XAxis dataKey="month" />
              <Legend />
              <Bar
                dataKey="owed"
                fill="#16803C"
                activeBar={<Rectangle fill="pink" stroke="green" />}
                onClick={(data: any, index: any) => setActiveIndex(index)}
              >
                <LabelList dataKey="owed" content={renderCustomizedLabel} />
                {stats.monthWiseSplits.map((entry: any, index: any) => (
                  <Cell
                    cursor="pointer"
                    fill={index === activeIndex ? "#8884d8" : "#82ca9d"}
                    key={`cell-${index}`}
                  />
                ))}
              </Bar>
            </BarChart>
          </div>
          <section>
            <div className="flex justify-between font-medium">
              <h2>
                Top Transactions for {stats.monthWiseSplits[activeIndex].month}
              </h2>
              <p className="text-green-900">
                {Number(stats.monthWiseSplits[activeIndex].owed).toFixed(2)} USD
              </p>
            </div>
            <ul>
              {stats.monthWiseSplits[activeIndex].expenses
                .sort((a: any, b: any) => b.amount - a.amount) // Sort expenses from high amount to low amount
                .map((expense: any, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between bg-white px-2 py-1 items-center border-b-2 border-gray-100 hover:bg-gray-100 transition duration-300 ease-in-out"
                  >
                    <div className="flex justify-center items-center">
                      <div className="items-center bg-slate-500 rounded-sm mr-2 px-2 py-1 text-white">
                        <div className="text-xs">
                          {new Date(expense.date).toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </div>
                        <div className="text-md">
                          {new Date(expense.date).toLocaleDateString("en-US", {
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="flex-col">
                        <p>{expense.description}</p>
                        <p className="text-xs text-gray-500">Paid by Mahesh</p>
                      </div>
                    </div>
                    <p>${expense.amount}</p>
                  </li>
                ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
