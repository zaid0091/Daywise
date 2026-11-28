"use client";

import React, { useEffect } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useSettingsStore, applyTheme } from "../../stores/settingsStore";
import { useMounted } from "../../lib/shared/useMounted";

export function ThemeToggle() {
  const mounted = useMounted();
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  useEffect(() => {
    useSettingsStore.persist.rehydrate();
  }, []);

  // Ensure theme settings are applied correctly on mount
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [mounted, theme]);

  if (!mounted) {
    return (
      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted opacity-50" aria-label="Toggle theme">
        <Sun className="h-[18px] w-[18px]" />
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[18px] w-[18px] text-amber-500" />;
      case "dark":
        return <Moon className="h-[18px] w-[18px] text-indigo-400" />;
      default:
        return <Laptop className="h-[18px] w-[18px] text-muted" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Light mode";
      case "dark":
        return "Dark mode";
      default:
        return "System theme";
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors duration-200 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus:ring-2 focus:ring-accent cursor-pointer"
      title={`Current: ${getLabel()}. Click to change.`}
      aria-label="Toggle theme"
    >
      {getIcon()}
    </button>
  );
}
