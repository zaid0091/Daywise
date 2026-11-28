import React from "react";
import { cn } from "../../lib/utils";

const DOT = {
  emerald: "bg-emerald-400",
  indigo: "bg-indigo-400",
  amber: "bg-amber-400",
  cyan: "bg-cyan-400",
  white: "bg-white",
};

export function SectionBadge({ children, className, variant = "emerald", pulse = false, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-shade-30 select-none",
        className
      )}
      {...props}
    >
      {pulse && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", DOT[variant] ?? DOT.emerald)} />}
      <span className="leading-none">{children}</span>
    </div>
  );
}
