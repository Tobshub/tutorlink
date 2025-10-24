"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useOnboardingStore, type SessionType } from "@/stores/onboarding";

const SESSION_TYPES: SessionType[] = ["Live", "On-Demand", "Recorded"];

export default function TutorSessionType() {
    const preferredSessionTypes = useOnboardingStore((s) => s.preferredSessionTypes);
    const toggleSessionType = useOnboardingStore((s) => s.toggleSessionType);

    const handleSelectAll = () => {
        if (preferredSessionTypes.size === SESSION_TYPES.length) {
            // If all are selected, deselect all
            SESSION_TYPES.forEach(type => toggleSessionType(type));
        } else {
            // If not all are selected, select all
            SESSION_TYPES.forEach(type => {
                if (!preferredSessionTypes.has(type)) {
                    toggleSessionType(type);
                }
            });
        }
    };

    const isAllSelected = preferredSessionTypes.size === SESSION_TYPES.length;

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">

                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <h2 className="mb-2 font-poppins text-2xl font-semibold text-neutral-800">Preferred Session Type</h2>
                    <div className="mb-6 h-px w-full bg-neutral-300"></div>
                    <p className="mb-6 text-neutral-600">
                        Help our AI connect you with the right students by selecting your preferred session types.
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {SESSION_TYPES.map((type) => (
                            <Chip key={type} selected={preferredSessionTypes.has(type)} onClick={() => toggleSessionType(type)}>
                                {type}
                            </Chip>
                        ))}
                        <Chip selected={isAllSelected} onClick={handleSelectAll}>
                            Select All
                        </Chip>
                    </div>

                    <div className="mt-8 text-center">
                        <Button asChild variant="brand" className="rounded-full px-8 py-6 text-black">
                            <Link href="/onboarding/tutor/summary">Next</Link>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
