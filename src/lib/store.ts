import { useSession } from "next-auth/react";
import { create } from "zustand";

interface userState {
  user: any;
  setUser: (user: any) => void;
  resetStore: () => void;
}

export const useUserStore = create<userState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetStore: () => set({ user: null }),
}));
