import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider font-mono",
  {
    variants: {
      variant: {
        default: "bg-brand/10 text-brand border-brand/25",
        subtle: "bg-surface-2/70 text-slate-300 border-slate-700/50",
        danger: "bg-red-500/10 text-red-300 border-red-500/25",
        warning: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
        info: "bg-blue-500/10 text-blue-300 border-blue-500/25",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
