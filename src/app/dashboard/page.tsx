"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/lib/store";
import API from "@/lib/api";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import domtoimage from "dom-to-image";

import { MonthlyStats } from "@/components/Monthly";
import { STUser } from "@/components/STUser";
import ModalPicker from "@/components/STDatePicker";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const [monthlyStats, setMonthlyStats] = useState<any>();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [downloading, setDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userStore = useUserStore();

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const snapshotCreator = () => {
    return new Promise((resolve, reject) => {
      try {
        const scale = window.devicePixelRatio;
        const element = wrapperRef.current; // You can use element's ID or Class here
        if (element) {
          domtoimage
            .toBlob(element, {
              height: 950,
              width: 1200,
              style: {
                transform: "scale(" + scale + ")",
                transformOrigin: "top left",
                width: "1400px",
                height: "1000px",
              },
            })
            .then((blob) => {
              resolve(blob);
            });
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  const shareImage = async () => {
    if (navigator.share) {
      setDownloading(true);
      await snapshotCreator();
      const blob: any = await snapshotCreator();
      const data = {
        files: [
          new File([blob], "file.png", {
            type: "image/png",
          }),
        ],
      };
      navigator
        .share(data)
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error))
        .finally(() => setDownloading(false));
    }
  };

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
          <h1 className={"text-xl font-semibold"}>Splitrck</h1>
        </div>
        {user && <STUser user={user} />}
      </header>
      <div className="flex justify-between mt-2 px-4">
        <h2 className="text-[#4cb799] font-semibold">Monthly Stats</h2>
        <div className="flex gap-2 items-center">
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
                  getFormattedDate(selectedMonth) ===
                  getFormattedDate(new Date())
                ) {
                  return;
                }
                setSelectedMonth(
                  new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1))
                );
              }}
            />
          </div>
          <Share2
            height={21}
            width={24}
            className="border border-input rounded-md p-[3px] hover:bg-accent hover:text-accent-foreground cursor-pointer"
            onClick={shareImage}
          />
        </div>
      </div>
      <ModalPicker
        isModelOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <div
        className="px-4 bg-white py-1"
        ref={(el) => (wrapperRef.current = el)}
      >
        <div
          className={`flex justify-between + ${downloading ? " py-1 " : "hidden"} `}
        >
          <h2
            className={`text-[#4cb799] font-semibold`}
          >
            {getFormattedDate(selectedMonth)} Stat
          </h2>
          <div className="border-l-2 px-2">
            <p className="text-[10px]">
              Report by <span className="font-semibold">Splitrck</span>
            </p>
            <p className="text-[8px]">splitrck.mtd.wtf</p>
          </div>
        </div>
        {monthlyStats && <MonthlyStats stats={monthlyStats} />}
      </div>
    </main>
  );
}
