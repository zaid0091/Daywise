import React from "react";
import { cn } from "../../lib/utils";

/**
 * A responsive container component.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {React.ElementType} [props.as]
 */
export function Container({ children, className, as: Component = "div", ...props }) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
