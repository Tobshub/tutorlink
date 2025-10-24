"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useOnboardingStore, type TeachingLevel } from "@/stores/onboarding";

const TEACHING_LEVELS: TeachingLevel[] = ["Primary", "Secondary", "Tertiary"];

export default function TutorTeachingLevels() {
    const teachingLevels = useOnboardingStore((s) => s.teachingLevels);
    const toggleTeachingLevel = useOnboardingStore((s) => s.toggleTeachingLevel);

    const handleSelectAll = () => {
        if (teachingLevels.size === TEACHING_LEVELS.length) {
            // If all are selected, deselect all
            TEACHING_LEVELS.forEach(level => toggleTeachingLevel(level));
        } else {
            // If not all are selected, select all
            TEACHING_LEVELS.forEach(level => {
                if (!teachingLevels.has(level)) {
                    toggleTeachingLevel(level);
                }
            });
        }
    };

    const isAllSelected = teachingLevels.size === TEACHING_LEVELS.length;

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">

                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <h2 className="mb-2 font-poppins text-2xl font-semibold text-neutral-800">Teaching Levels</h2>
                    <div className="mb-6 h-px w-full bg-neutral-300"></div>
                    <p className="mb-6 text-neutral-600">
                        What levels of students do you teach? Select all that apply — this helps us match you with learners at the right stage.
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {TEACHING_LEVELS.map((level) => (
                            <Chip key={level} selected={teachingLevels.has(level)} onClick={() => toggleTeachingLevel(level)}>
                                {level}
                            </Chip>
                        ))}
                        <Chip selected={isAllSelected} onClick={handleSelectAll}>
                            Select All
                        </Chip>
                    </div>

                    <div className="mt-8 text-center">
                        <Button asChild variant="brand" className="rounded-full px-8 py-6 text-black">
                            <Link href="/onboarding/tutor/experience">Next</Link>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
