"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import toast, { Toaster } from "react-hot-toast";
import { ResponsiveContainer, Pie, Cell } from "recharts";
import dynamic from "next/dynamic";

import { STAnnoyUser } from "@/components/STAnnoyUser";

const PieChartWithoutSSR = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  {
    ssr: false,
  }
);

export default function Page() {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const { data } = useSession();
  const router = useRouter();

  const demoData = {
    topCategories: [
      { name: "Rent", value: 300 },
      { name: "Food", value: 220 },
      { name: "Travel", value: 150 },
    ],
  };

  useEffect(() => {
    if (data && data.user) {
      router.push("/dashboard");
    }
  });
  // send notify message every 1 second and annoy the user with the message and send only 3 messages
  useEffect(() => {
    const notifyData = [
      {
        title: "Papa",
        description: "You are out of money😠, Again?",
        time: "1 min ago",
      },
      {
        title: "Random Relative",
        description: "Forwarded money saving quotes",
        time: "now",
      },
    ];
    const notify = (count: any) =>
      toast.custom((t) => <STAnnoyUser item={notifyData[count]} />);

    let count = 0;
    const interval = setInterval(() => {
      notify(count);
      count++;
      if (count === notifyData.length) {
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5 max-w-2xl mx-auto homepage-account">
      <main className="flex-col">
        <header className="flex justify-between items-center">
          <h1 className="font-semibold text-xl">Splitrck</h1>
          <button
            className="flex border-[1px] border-black rounded-md py-1 px-2 items-center"
            onClick={() =>
              window.open("https://github.com/MaheshtheDev/Splitrck", "_blank")
            }
          >
            <Image
              src="/github-mark.svg"
              width={20}
              height={20}
              alt="Github"
              className="text-white mr-2"
            />
            <div className="flex flex-col items-start tracking-wide">
              <p className="text-[6px] text-gray-500">Made by</p>
              <p className="text-[9px]">MaheshtheDev</p>
            </div>
          </button>
        </header>
        <Toaster
          containerStyle={{
            top: "4rem",
          }}
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
        <section className="mt-32 mb-10">
          <p className="text-3xl font-medium text-[#5CC5A7] ">
            Analytics for your Splitwise
          </p>
          <p className="opacity-[0.5]">know more about your Splits</p>
          <button
            className="bg-[#5CC5A7] text-white px-3 py-1 rounded-full flex align-middle items-center"
            onClick={() => {
              signIn("splitwise");
            }}
            data-umami-event="Sign in with Splitwise"
          >
            <Image
              src="/splitwise.svg"
              width={15}
              height={15}
              alt="Splitrck"
              className="mr-2"
            />
            Sign in with Splitwise
          </button>
        </section>
        <section className="text-center">
          <p className="text-xl">Spend, Track, Save</p>
          <p className="text-xs opacity-55">
            get your monthly stats with better analytics
          </p>
          <div className="flex justify-between align-middle items-center my-4">
            <div className="w-[45%] rounded-md py-1 px-2">
              <ResponsiveContainer width="100%" height={40 * 3}>
                <PieChartWithoutSSR
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  width={100}
                  height={150}
                >
                  <Pie
                    data={demoData.topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    valueKey="value"
                  >
                    {demoData.topCategories.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChartWithoutSSR>
              </ResponsiveContainer>
              <div className="flex gap-2">
                {demoData.topCategories.map((d: any, i: any) => {
                  return (
                    <div key={i} className=" text-xs items-center">
                      <div className="flex justify-center items-center">
                        <div
                          className="w-2 h-2"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        ></div>
                        <p className="ml-1 truncate">{d.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-[55%] bg-[#f1f1f140] py-2 px-1 rounded-md">
              <p className="font-semibold">Top Categories</p>
              <p className="text-[10px] opacity-45">
                Check where in which categories you are spending most, monthly
              </p>
            </div>
          </div>
          <div className="flex items-center my-8 justify-around">
            <div className="mb-2 w-[55%] bg-[#f1f1f140] py-2 px-1 rounded-md">
              <p className="font-semibold">Finanical Overview</p>
              <p className="text-[10px] opacity-45">
                Overall, spent and lent money over the selected month
              </p>
            </div>
            <div className="">
              <div className="flex flex-col justify-start items-start">
                <p className="text-[10px] text-[#808080] font-bold">Lent</p>
                <span className=" font-bold text-[#008000]">$994.86</span>
              </div>
              <div className="flex flex-col justify-start items-start">
                <span className="text-[10px] text-[#808080] font-bold">
                  Spent
                </span>
                <span className="font-bold text-[#F00]">$191.97</span>
              </div>
            </div>
          </div>
        </section>
        <script
          defer
          src="https://analytics.maheshthedev.me/script.js"
          data-website-id="7ee546fb-a4b5-473e-a545-9d85a9720af0"
        ></script>
      </main>
    </div>
  );
}
