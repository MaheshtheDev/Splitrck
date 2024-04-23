"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store";
import API from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { MonthlyStats } from "@/components/Monthly";
import { STUser } from "@/components/STUser";
import ModalPicker from "@/components/STDatePicker";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<any>();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userStore = useUserStore();
  const router = useRouter();

  const fetchData = async () => {
    const [userData, error, status] = await API.getUser();
    if (userData && status == 200) {
      setUser(userData);
      userStore.setUser(userData);
    } else {
      router.push("/")
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
        setMonthlyStats(data);
      }
    };

    if (user) {
      fetchMonthlyStats(selectedMonth);
    }
  }, [user, selectedMonth]);

  return (
    <main className="">
      <meta name="theme-color" content="#4cb799"></meta>
      <header className="pt-2 pb-1 flex justify-between border-b-2 px-4 bg-[#4cb799] text-white">
        <div className="">
          {/*<Image
            src={"/icon.svg"}
            height={25}
            width={25}
            alt="Splitrck Icon"
            className="mr-2"
          />*/}
          <h1 className={"text-xl font-semibold"}>Splitrck</h1>
        </div>
        {user && <STUser user={user} />}
      </header>
      <div className="flex justify-between mt-2 px-4">
        <h2 className="text-[#4cb799] font-semibold">Monthly Stats</h2>
        <div className="flex transition-colors bg-transparent border border-input shadow-sm rounded-md items-center">
          <ChevronLeft
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-5 w-5 bg-transparent p-0 opacity-50 hover:opacity-100"
            opacity={0.75}
            onClick={() => {
              const newDate = new Date(
                selectedMonth.setMonth(selectedMonth.getMonth() - 1)
              );
              setSelectedMonth(newDate);
            }}
          />
          <p
            className="px-2 text-sm"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {getFormattedDate(selectedMonth)}
          </p>
          <ChevronRight
            aria-disabled={true}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-5 w-5 bg-transparent p-0 opacity-50 hover:opacity-100"
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
      <ModalPicker
        isModelOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <div className="px-4">
        {monthlyStats && <MonthlyStats stats={monthlyStats} />}
      </div>
    </main>
  );
}
