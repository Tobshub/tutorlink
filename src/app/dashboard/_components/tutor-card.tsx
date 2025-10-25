"use client";
import Image from "next/image";

export type TutorCardProps = {
    name: string;
    subjects: string[];
    yearsOfExperience: number;
    teachingStyle?: string[] | null;
};

export function TutorCard({ name, subjects, yearsOfExperience }: TutorCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/60">
            <div className="relative h-40 w-full bg-neutral-100">
                <Image src="/images/placeholder-tutor.jpg" alt={name} fill className="object-cover" />
            </div>
            <div className="p-4">
                <div className="text-sm text-neutral-500">{subjects.slice(0, 2).join(" • ")}</div>
                <div className="mt-1 text-base font-semibold text-neutral-900">{name}</div>
                <div className="mt-1 text-sm text-neutral-600">
                    {yearsOfExperience} yrs
                </div>
            </div>
        </div>
    );
}
