"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useOnboardingStore } from "@/stores/onboarding";
import type { SubjectInterest } from "@/stores/onboarding";

const subjects: SubjectInterest[] = [
    "Mathematics", "English", "Physics", "Chemistry", "Biology", "Geography",
    "Economics", "History", "Computer Science", "Art", "Music", "Physical Education",
];

export default function StudentSubjects() {
    const role = useOnboardingStore((s) => s.role);
    const hydrated = useOnboardingStore((s) => s.hydrated);
    const selected = useOnboardingStore((s) => s.subjectInterests);
    const toggle = useOnboardingStore((s) => s.toggleSubjectInterest);
    const router = useRouter();

    useEffect(() => {
        if (!hydrated) return;
        if (role !== "student") router.replace("/onboarding");
    }, [hydrated, role, router]);

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <h2 className="mb-2 font-poppins text-2xl font-semibold text-neutral-800">What subjects are you interested in?</h2>
                    <p className="mb-6 text-neutral-600">Select all that apply.</p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {subjects.map((s) => (
                            <Chip key={s} selected={selected.has(s)} onClick={() => toggle(s)}>
                                {s}
                            </Chip>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Button asChild variant="brandOutline" className="rounded-full px-6">
                            <Link href="/onboarding/student/tutor-gender">Back</Link>
                        </Button>
                        <Button asChild variant="brand" className="rounded-full px-8 py-6 text-black">
                            <Link href="/onboarding/student/summary">Next</Link>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
