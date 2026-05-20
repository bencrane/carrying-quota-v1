import { create } from "zustand";

interface AppState {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  toggleNav: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  navOpen: false,
  setNavOpen: (open) => set({ navOpen: open }),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
}));
