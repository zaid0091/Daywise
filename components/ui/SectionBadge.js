import React from "react";
import { cn } from "../../lib/utils";

export function SectionBadge({
  children,
  className,
  variant = "emerald", // "emerald" | "indigo" | "amber" | "cyan" | "white"
  pulse = true,
  ...props
}) {
  const variantStyles = {
    emerald: {
      wrapper: "border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
      dot: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
    },
    indigo: {
      wrapper: "border-indigo-500/30 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-indigo-500/5 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.15)]",
      dot: "bg-indigo-400 shadow-[0_0_8px_#818cf8]",
    },
    amber: {
      wrapper: "border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]",
      dot: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
    },
    cyan: {
      wrapper: "border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-cyan-500/5 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
      dot: "bg-cyan-400 shadow-[0_0_8px_#22d3ee]",
    },
    white: {
      wrapper: "border-white/25 bg-white/5 text-white shadow-[0_0_15px_rgba(255,255,255,0.08)]",
      dot: "bg-white shadow-[0_0_8px_#ffffff]",
    },
  };

  const style = variantStyles[variant] || variantStyles.emerald;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-mono font-bold tracking-[0.18em] uppercase select-none transition-all duration-300 hover:border-white/40 backdrop-blur-md",
        style.wrapper,
        className
      )}
      {...props}
    >
      {pulse && (
        <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse shrink-0", style.dot)} />
      )}
      <span className="leading-none">{children}</span>
    </div>
  );
}
