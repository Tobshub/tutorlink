import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", ...props }, ref) => {
        return (
            <input
                type={type}
                ref={ref}
                className={cn(
                    "block w-full rounded-full border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-500",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88FF] focus-visible:ring-offset-1",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";
