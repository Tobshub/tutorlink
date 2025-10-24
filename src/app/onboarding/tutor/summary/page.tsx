"use client";
import Link from "next/link";
import { Navbar } from "@/app/_components/navbar";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/stores/onboarding";

export default function TutorSummary() {
    const role = useOnboardingStore((s) => s.role);
    const subjectInterests = Array.from(useOnboardingStore((s) => s.subjectInterests));
    const teachingLevels = Array.from(useOnboardingStore((s) => s.teachingLevels));
    const yearsOfExperience = useOnboardingStore((s) => s.yearsOfExperience);
    const teachingStyle = Array.from(useOnboardingStore((s) => s.teachingStyle));
    const preferredSessionTypes = Array.from(useOnboardingStore((s) => s.preferredSessionTypes));

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
                            <div className="text-sm text-neutral-500">Subjects Taught</div>
                            <div className="font-medium">{subjectInterests.length ? subjectInterests.join(", ") : "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Teaching Levels</div>
                            <div className="font-medium">{teachingLevels.length ? teachingLevels.join(", ") : "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Years of Experience</div>
                            <div className="font-medium">{yearsOfExperience ? `${yearsOfExperience} years` : "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Teaching Style</div>
                            <div className="font-medium">{teachingStyle.length ? teachingStyle.join(", ") : "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Preferred Session Types</div>
                            <div className="font-medium">{preferredSessionTypes.length ? preferredSessionTypes.join(", ") : "—"}</div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Button asChild variant="brandOutline" className="rounded-full px-6">
                            <Link href="/onboarding/tutor/subjects">Back</Link>
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
