"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data && data.user) {
      router.push("/dashboard");
    }
  });

  return (
    <div className="p-5 max-w-md mx-auto homepage-account">
      <main className="flex-col">
        <header className="flex justify-between items-center">
          <h1 className="font-semibold text-xl">Splitrck</h1>
          <button
            className="flex bg-black rounded-md text-white py-1 px-2 items-center"
            onClick={() =>
              window.open("https://github.com/MaheshtheDev/Splitrck", "_blank")
            }
          >
            <Image
              src="/github-mark-white.svg"
              width={20}
              height={20}
              alt="Github"
              className="text-white mr-1"
            />
            <div className="flex flex-col items-start tracking-wide">
              <p className="text-[6px] text-gray-400">Made by</p>
              <p className="text-[8px]">MaheshtheDev</p>
            </div>
          </button>
        </header>
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
