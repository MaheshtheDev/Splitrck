"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUserStore } from "@/lib/store";
import API from "@/lib/api";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

import { MonthlyStats } from "@/components/Monthly";
import { STUser } from "@/components/STUser";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const [monthlyStats, setMonthlyStats] = useState<any>();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const userStore = useUserStore();

  const fetchData = async () => {
    const [userData, error] = await API.getUser();
    if (userData) {
      setUser(userData);
      userStore.setUser(userData);
    }
  };

  /**
   * Get formatted date in the format of "Jan'22"
   */
  const getFormattedDate = (date: Date) => {
    return `${date.toLocaleString("en-US", {
      month: "short",
    })}'${date.getFullYear().toString().slice(2, 4)}`;
  };

  if (!userStore.user) {
    fetchData();
  }

  useEffect(() => {
    const fetchMonthlyStats = async (date: any) => {
      const [data, error] = await API.getMonthlyExpenses(user.id, date);
      if (data) {
        console.log(data);
        setMonthlyStats(data);
      }
    };

    if (user) {
      fetchMonthlyStats(selectedMonth);
    }
  }, [user, selectedMonth]);

  return (
    <main className="">
      <header className="pt-3 pb-1 flex justify-between border-b-2 px-4 bg-[#4cb799] text-white">
        <div className="">
          {/*<Image
            src={"/icon.svg"}
            height={25}
            width={25}
            alt="Splitrck Icon"
            className="mr-2"
          />*/}
          <h1 className={"text-lg font-semibold"}>Splitrck</h1>
          <p className="text-[8px] opacity-75">Analytics for your Splitwise</p>
        </div>
        {user && <STUser user={user} />}
      </header>
      <div className="flex justify-between mt-2 px-4">
        <h2 className="text-[#4cb799] font-semibold">Monthly Stats</h2>
        <div className="flex">
          <ChevronLeft
            className="bg-[#56dbcb] rounded-sm cursor-pointer"
            opacity={0.75}
            onClick={() => {
              const newDate = new Date(
                selectedMonth.setMonth(selectedMonth.getMonth() - 1)
              );
              setSelectedMonth(newDate);
            }}
          />
          <p className="mx-2">{getFormattedDate(selectedMonth)}</p>
          <ChevronRight
            className="bg-[#56dbcb] rounded-sm"
            opacity={
              getFormattedDate(selectedMonth) === getFormattedDate(new Date())
                ? 0.2
                : 0.75
            }
            onClick={() => {
              if (
                getFormattedDate(selectedMonth) === getFormattedDate(new Date())
              ) {
                return;
              }
              setSelectedMonth(
                new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1))
              );
            }}
          />
        </div>
      </div>
      <div className="px-4">
        {monthlyStats && <MonthlyStats stats={monthlyStats} />}
      </div>
    </main>
  );
}
