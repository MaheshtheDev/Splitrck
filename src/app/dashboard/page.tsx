"use client";

import { useEffect, useState } from "react";
import { STUser } from "@/components/STUser";
import { useUserStore } from "@/lib/store";
import { Stats } from "@/components/Stats";
import API from "@/lib/api";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<{
    owedByMe: { friend: any; amount: number };
    owedToMe: { friend: any; amount: number };
    monthWiseSplits: any;
  } | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<any>(null);
  const userStore = useUserStore();

  const fetchData = async () => {
    const [userData, error] = await API.getUser();
    if (userData) {
      setUser(userData);
      userStore.setUser(userData);
    }
  };

  if (!userStore.user) {
    fetchData();
  }

  useEffect(() => {
    const fetchStats = async () => {
      const [data, error] = await API.getStats(user.id);
      if (data) {
        setStats(data);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <main className="px-4">
      <header className="pt-5 pb-2 flex justify-between">
        <h1 className={"text-xl font-semibold text-[#16803C]"}>Splitrck</h1>
        <STUser />
      </header>
      <Stats user={user} stats={stats} />
    </main>
  );
}
