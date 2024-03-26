"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import toast, { Toaster } from "react-hot-toast";

import { STAnnoyUser } from "@/components/STAnnoyUser";

export default function Page() {
  const { data } = useSession();
  const router = useRouter();

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
        title: "Mom❤️",
        description: "Emyandi, akada ekuva karuchupettavu?",
        time: "now",
      },
      {
        title: "Random Relative",
        description: "Forwareded money saving quotes",
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
            className="flex border-2 border-black rounded-md py-1 px-2 items-center"
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
              <p className="text-[6px] text-gray-400">Made by</p>
              <p className="text-[8px]">MaheshtheDev</p>
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
            className="bg-[#5CC5A7] text-white px-3 py-1 rounded-full flex align-middle items-center my-4"
            onClick={() => {
              signIn("splitwise");
            }}
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
          <p></p>
        </section>
      </main>
    </div>
  );
}
