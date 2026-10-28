import { create } from 'zustand';

export type GlucoseUnit = 'mmol/L' | 'mg/dL';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  glucoseUnit: GlucoseUnit;
  locale: string;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setGlucoseUnit: (unit: GlucoseUnit) => void;
  setLocale: (locale: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  sidebarOpen: true,
  glucoseUnit: 'mmol/L',
  locale: 'en',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setGlucoseUnit: (unit) => set({ glucoseUnit: unit }),
  setLocale: (locale) => set({ locale }),
}));
