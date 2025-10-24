"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useOnboardingStore, type LearningGoal } from "@/stores/onboarding";

const GOALS: LearningGoal[] = [
    "Exam Prep",
    "Concept Mastery",
    "Homework",
    "Test Readiness",
    "Revision & Practice",
    "Long-term Learning",
    "Test Readiness (WAEC, IELTS, SAT, etc)",
];

export default function StudentGoals() {
    const role = useOnboardingStore((s) => s.role);
    const hydrated = useOnboardingStore((s) => s.hydrated);
    const goals = useOnboardingStore((s) => s.goals);
    const toggleGoal = useOnboardingStore((s) => s.toggleGoal);
    const router = useRouter();

    // Guard: ensure the user picked 'student' role (wait for hydration)
    useEffect(() => {
        if (!hydrated) return;
        if (role !== "student") router.replace("/onboarding");
    }, [hydrated, role, router]);

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">

                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <h1 className="mb-2 font-poppins text-2xl font-semibold text-neutral-800">Goals</h1>
                    <p className="mb-6 text-neutral-600">Set your learning goals — and let TutorLink guide you to success.</p>

                    <div className="flex flex-wrap gap-3">
                        {GOALS.map((g) => (
                            <Chip key={g} selected={goals.has(g)} onClick={() => toggleGoal(g)}>
                                {g}
                            </Chip>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Button asChild variant="brand" className="rounded-full px-8 py-6 text-black">
                            <Link href="/onboarding/student/style">Next</Link>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
