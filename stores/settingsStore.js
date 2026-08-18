import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create()(
  persist(
    (set) => ({
      // Theme settings: 'light' | 'dark' | 'system'
      theme: "system",
      
      // Training settings
      dateRange: "2000-2099",
      customRangeStart: 1900,
      customRangeEnd: 2099,
      soundEnabled: true,
      hapticsEnabled: true,
      
      // Accessibility settings
      reducedMotion: false,

      // Setters
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== "undefined") {
          applyTheme(theme);
        }
      },
      setDateRange: (dateRange) => set({ dateRange }),
      setCustomRange: (start, end) => set({ customRangeStart: start, customRangeEnd: end }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),
      setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
    }),
    {
      name: "daywise-settings-v2", // version 2 to prevent cache issues
      skipHydration: true,
    }
  )
);

// Helper function to dynamically apply theme class to HTML element
export function applyTheme(theme) {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;
  
  root.classList.remove("light", "dark");
  
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}
