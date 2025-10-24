import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionPill({ className, children }: React.PropsWithChildren<{ className?: string }>) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border border-dashed border-[--brand] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[--brand] shadow-xs backdrop-blur-sm",
                className
            )}
        >
            {children}
        </span>
    );
}
