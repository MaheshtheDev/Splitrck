import { use, useEffect, useState } from "react";

import { signIn, signOut, useSession } from "next-auth/react";
import { CircleUserRound, Contact, Github } from "lucide-react";

import { LogOut, Mail, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/lib/store";
import { CONSTANTS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

export function STUser({ user }: { user: any }) {
  const router = useRouter();

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex text-center items-center">
              <p>{user.first_name}</p>
              <User className="w-5 h-5 ml-2" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  (window.location.href =
                    "https://github.com/MaheshtheDev/Splitrck")
                }
              >
                <Github className="mr-2 h-4 w-4" />
                <span>GitHub Repo</span>
              </DropdownMenuItem>
              {/*<DropdownMenuItem>
                <Contact className="mr-2 h-4 w-4" />
                <span>Contact us</span>
              </DropdownMenuItem>*/}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
                router.push("/");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button
          className="bg-green-700 py-2 px-4 rounded-md text-white"
          //onClick={() => {
          //  signIn("splitwise");
          //}}
        >
          {/*Sign in with Splitwise*/}
        </button>
      )}
    </>
  );
}
