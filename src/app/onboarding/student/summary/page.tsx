"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/_components/navbar";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/stores/onboarding";

export default function StudentSummary() {
    const role = useOnboardingStore((s) => s.role);
    const goals = Array.from(useOnboardingStore((s) => s.goals));
    const style = Array.from(useOnboardingStore((s) => s.style));
    const gender = useOnboardingStore((s) => s.preferredTutorGender);
    const router = useRouter();

    useEffect(() => {
        if (role !== "student") router.replace("/onboarding");
    }, [role, router]);

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <Navbar />

                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <h2 className="mb-6 font-poppins text-2xl font-semibold text-neutral-800">Summary</h2>

                    <div className="space-y-4 text-neutral-800">
                        <div>
                            <div className="text-sm text-neutral-500">Role</div>
                            <div className="font-medium">{role ?? "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Goals</div>
                            <div className="font-medium">{goals.length ? goals.join(", ") : "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Learning Style</div>
                            <div className="font-medium">{style.length ? style.join(", ") : "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Preferred Tutor Gender</div>
                            <div className="font-medium">{gender ?? "—"}</div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Button asChild variant="brandOutline" className="rounded-full px-6">
                            <Link href="/onboarding/student/goals">Back</Link>
                        </Button>
                        <Button variant="brand" className="rounded-full px-8 py-6 text-black">
                            Finish
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
