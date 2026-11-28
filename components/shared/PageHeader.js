import React from "react";
import { cn } from "../../lib/utils";

export function PageHeader({ eyebrow, title, description, action, className, variant: _variant, ...props }) {
  return (
    <header
      className={cn(
        "mb-10 flex flex-col gap-6 border-b border-hairline-dark pb-10 pt-8 md:flex-row md:items-end md:justify-between md:pb-12 md:pt-12",
        className
      )}
      {...props}
    >
      <div className="max-w-2xl space-y-4">
        {eyebrow && <p className="inline-flex w-fit self-start items-center rounded-sm border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium uppercase tracking-[0.14em] leading-none text-shade-30">{eyebrow}</p>}
        <h1 className="display-lg font-heading font-light tracking-tight text-balance text-white">
          {title}
        </h1>
        {description && (
          <p className="max-w-prose text-base leading-relaxed text-shade-40">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </header>
  );
}
