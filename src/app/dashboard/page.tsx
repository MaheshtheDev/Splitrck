"use client";

import { useEffect, useState } from "react";
import { STUser } from "@/components/STUser";
import { CONSTANTS } from "@/lib/constants";
import { useUserStore } from "@/lib/store";
import { Stats } from "@/components/Stats";

type Tabs = "stats" | "spendings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tabs>("stats");
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<{
    owedByMe: { friend: any; amount: number };
    owedToMe: { friend: any; amount: number };
    monthWiseSplits: any;
  } | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<any>(null);
  const userStore = useUserStore();

  const fetchData = async () => {
    const response = await fetch(CONSTANTS.BASE_URL + "/api/user", {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      userStore.setUser(data.user);
    }
  };

  if (!userStore.user) {
    fetchData();
  }

  useEffect(() => {
    const fetchRecentExpenses = async () => {
      const response = await fetch("/api/expenses/recent?userId=" + user.id, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    };

    const fetchStats = async () => {
      const response = await fetch("/api/expenses/stats?userId=" + user.id, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    };

    if (user) {
      fetchStats();
      fetchRecentExpenses();
    }
  }, [user]);

  return (
    <main className="px-4">
      <header className="pt-5 pb-2 flex justify-between">
        <h1 className={"text-xl font-medium text-[#16803C]"}>Splitrck</h1>
        <STUser />
      </header>
      <Stats user={user} stats={stats} recentExpenses={recentExpenses} />
    </main>
  );
}
