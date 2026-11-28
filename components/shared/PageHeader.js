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
        {eyebrow && <p className="text-sm text-shade-40">{eyebrow}</p>}
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
