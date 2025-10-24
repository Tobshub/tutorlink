"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export type ChipProps = {
    selected?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
};

export function Chip({ selected, onClick, children, className, disabled }: ChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            role="button"
            aria-pressed={!!selected}
            className={cn(
                "inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition",
                selected
                    ? "border-[#1E88FF] text-[#1E88FF] bg-[#F2F7FF] shadow-sm"
                    : "border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {children}
            {selected && (
                <span className="ml-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#1E88FF]" />
            )}
        </button>
    );
}
