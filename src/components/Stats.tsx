import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  CartesianGrid,
} from "recharts";

type StatsProps = {
  user: any;
  stats: {
    owedByMe: { friend: any; amount: number };
    owedToMe: { friend: any; amount: number };
    monthWiseSplits: any;
  } | null;
  recentExpenses: any;
};

export function Stats({ user, stats, recentExpenses }: StatsProps) {
  console.log(stats?.monthWiseSplits);
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
            <h2 className="text-md font-medium text-green-900">
              Monthly
            </h2>
            <BarChart
              width={375}
              height={300}
              data={stats.monthWiseSplits}
              maxBarSize={40}
              style={{}}
            >
              <CartesianGrid strokeDasharray="10 10" />
              <XAxis dataKey="month" />
              <Bar
                dataKey="owed"
                fill="#16803C"
                activeBar={<Rectangle fill="pink" stroke="green" />}
              />
            </BarChart>
          </div>
        </>
      )}
    </>
  );
}
