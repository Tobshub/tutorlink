"use client";
import Link from "next/link";
import { Navbar } from "@/app/_components/navbar";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useOnboardingStore, type TeachingStyle } from "@/stores/onboarding";

const TEACHING_STYLES: TeachingStyle[] = [
    "Interactive",
    "Visual",
    "Practical",
    "Structured",
    "Flexible",
    "Collaborative",
];

export default function TutorTeachingStyle() {
    const teachingStyle = useOnboardingStore((s) => s.teachingStyle);
    const toggleTeachingStyle = useOnboardingStore((s) => s.toggleTeachingStyle);

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <Navbar />

                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <h2 className="mb-2 font-poppins text-2xl font-semibold text-neutral-800">Teaching Style</h2>
                    <div className="mb-6 h-px w-full bg-neutral-300"></div>
                    <p className="mb-6 text-neutral-600">
                        How do you prefer to teach? Select all that apply to help us match you with compatible students.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {TEACHING_STYLES.map((style) => (
                            <Chip key={style} selected={teachingStyle.has(style)} onClick={() => toggleTeachingStyle(style)}>
                                {style}
                            </Chip>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Button asChild variant="brand" className="rounded-full px-8 py-6 text-black">
                            <Link href="/onboarding/tutor/session-type">Next</Link>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
