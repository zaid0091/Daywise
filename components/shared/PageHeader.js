import React from "react";
import { cn } from "../../lib/utils";
import { SectionBadge } from "../ui/SectionBadge";

export function PageHeader({ eyebrow, title, description, action, className, variant = "emerald", ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 border-b border-hairline-dark py-8 md:py-12 mb-8 md:mb-10 text-center",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <SectionBadge variant={variant}>
          {eyebrow}
        </SectionBadge>
      )}
      <div className="space-y-2">
        <h1 className="display-md text-white font-light leading-none tracking-tight font-heading">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed mx-auto">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3 pt-2">{action}</div>}
    </div>
  );
}
