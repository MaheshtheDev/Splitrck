import { use, useEffect, useState } from "react";

import { signIn, signOut, useSession } from "next-auth/react";
import { CircleUserRound } from "lucide-react";

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

export function STUser() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const userStore = useUserStore();

  const fetchData = async () => {
    const response = await fetch(CONSTANTS.BASE_URL + "/api/user", {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setUser(data.user);
      userStore.setUser(data.user);
    }
  };

  if (!userStore.user) {
    fetchData();
  }
  

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex text-center items-center">
              <p>{user.first_name}</p>
              <CircleUserRound className="h-7 w-7 ml-2" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
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
          onClick={() => {
            signIn("splitwise");
          }}
        >
          Sign in with Splitwise
        </button>
      )}
    </>
  );
}
