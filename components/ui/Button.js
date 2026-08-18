"use client";

import React from "react";
import { motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled = false,
      asChild = false,
      onClick,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none";

    const variants = {
      primary:
        "bg-white text-black font-semibold hover:bg-shade-30 active:bg-shade-40 shadow-[0_1px_2px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.4)]",
      "outline-on-dark":
        "bg-transparent text-white border border-white/25 hover:border-white hover:bg-white/10 active:bg-white/15",
      aloe:
        "bg-aloe text-black font-semibold hover:bg-aloe/90 active:bg-aloe/80 shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
      secondary:
        "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 active:bg-white/15",
      outline:
        "bg-transparent text-white border border-hairline-dark hover:border-white/30 hover:bg-white/5 active:bg-white/10",
      ghost:
        "bg-transparent text-shade-40 hover:text-white hover:bg-white/5 active:bg-white/10",
      danger:
        "bg-rose-950/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/40 hover:text-rose-200 active:bg-rose-900/60",
      link:
        "bg-transparent text-white hover:underline p-0 h-auto rounded-none",
    };

    const sizes = {
      sm: "h-8 px-3.5 py-1 text-xs gap-1.5 font-medium",
      md: "h-10 px-5 py-2 text-sm gap-2 font-medium",
      lg: "h-12 px-7 py-3 text-base gap-2.5 font-medium",
      icon: "h-10 w-10 p-0 rounded-full",
      "icon-sm": "h-8 w-8 p-0 rounded-full",
    };

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (asChild) {
      return (
        <Slot
          ref={ref}
          onClick={onClick}
          className={combinedClassName}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        whileHover={disabled ? {} : { scale: 1.015 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className={combinedClassName}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
