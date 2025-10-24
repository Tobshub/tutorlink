"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/_components/navbar";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useOnboardingStore, type TutorGender } from "@/stores/onboarding";

const GENDERS: TutorGender[] = ["Male", "Female", "Both"];

export default function StudentTutorGender() {
    const role = useOnboardingStore((s) => s.role);
    const gender = useOnboardingStore((s) => s.preferredTutorGender);
    const setGender = useOnboardingStore((s) => s.setPreferredTutorGender);
    const router = useRouter();

    useEffect(() => {
        if (role !== "student") router.replace("/onboarding");
    }, [role, router]);

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <Navbar />

                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <h2 className="mb-2 font-poppins text-2xl font-semibold text-neutral-800">Preferred Tutor Gender</h2>
                    <p className="mb-6 text-neutral-500">(Optional)</p>

                    <div className="flex flex-wrap gap-3">
                        {GENDERS.map((g) => (
                            <Chip key={g} selected={gender === g} onClick={() => setGender(g)}>
                                {g}
                            </Chip>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Button asChild variant="brand" className="rounded-full px-8 py-6 text-black">
                            <Link href="/onboarding/student/summary">Next</Link>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
