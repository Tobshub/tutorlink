"use client";
import Image from "next/image";
import type { PropsWithChildren } from "react";

export type TutorCardProps = {
    name: string;
    subjects: string[];
    yearsOfExperience: number;
    teachingStyle?: string[] | null;
} & PropsWithChildren;

export function TutorCard({ name, subjects, yearsOfExperience, children }: TutorCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200/60">
            <div>
                <div className="text-sm text-neutral-500">{subjects.slice(0, 2).join(" • ")}</div>
                <div className="mt-1 text-base font-semibold text-neutral-900">{name}</div>
                <div className="mt-1 text-sm text-neutral-600">
                    {yearsOfExperience} yrs
                </div>
                {children}
            </div>
        </div>
    );
}
