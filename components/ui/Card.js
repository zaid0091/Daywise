import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, variant = "default", ...props }) {
  const variants = {
    default:
      "rounded-2xl border border-hairline-dark bg-white/[0.03] text-white",
    cinematic:
      "rounded-2xl border border-hairline-dark bg-canvas-night-elevated text-white shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]",
    interactive:
      "rounded-2xl border border-hairline-dark bg-canvas-night-elevated text-white hover:border-white/20 hover:bg-[#121212] transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]",
    glow:
      "rounded-2xl border border-white/20 bg-canvas-night-elevated text-white ",
    ghost:
      "rounded-2xl border border-hairline-dark/60 bg-white/5 text-white",
  };

  return (
    <div
      className={cn(
        "transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6 md:p-7", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "font-heading text-lg md:text-xl font-semibold leading-tight tracking-tight text-white",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-xs md:text-sm text-shade-40 leading-relaxed", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 md:p-7 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center p-6 md:p-7 pt-0", className)}
      {...props}
    />
  );
}
