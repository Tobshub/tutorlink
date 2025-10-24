"use client";
import Link from "next/link";
import { Navbar } from "@/app/_components/navbar";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useOnboardingStore, type SubjectInterest } from "@/stores/onboarding";

const SUBJECTS: SubjectInterest[] = [
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
    "Economics",
    "History",
    "Computer Science",
    "Art",
    "Music",
    "Physical Education",
];

export default function TutorSubjects() {
    const subjectInterests = useOnboardingStore((s) => s.subjectInterests);
    const toggleSubjectInterest = useOnboardingStore((s) => s.toggleSubjectInterest);

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <Navbar />

                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <h2 className="mb-2 font-poppins text-2xl font-semibold text-neutral-800">Subjects Taught</h2>
                    <div className="mb-6 h-px w-full bg-neutral-300"></div>
                    <p className="mb-6 text-neutral-600">Please select your subjects of interest.</p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {SUBJECTS.map((subject) => (
                            <Chip key={subject} selected={subjectInterests.has(subject)} onClick={() => toggleSubjectInterest(subject)}>
                                {subject}
                            </Chip>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Button asChild variant="brand" className="rounded-full px-8 py-6 text-black">
                            <Link href="/onboarding/tutor/teaching-levels">Next</Link>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
