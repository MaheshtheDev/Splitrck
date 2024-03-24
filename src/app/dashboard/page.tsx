"use client";

import { useEffect, useState } from "react";
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
      const [data, error] = await API.getMonthlyExpenses(
        user.id,
        date
      );
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
    <main className="px-4">
      <header className="pt-5 pb-2 flex justify-between">
        <h1 className={"text-xl font-semibold text-[#16803C]"}>Splitrck</h1>
        <STUser user={user} />
      </header>
      <div className="flex justify-between">
        <h2>Monthly Stats</h2>
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
      {monthlyStats && <MonthlyStats stats={monthlyStats} />}
    </main>
  );
}
