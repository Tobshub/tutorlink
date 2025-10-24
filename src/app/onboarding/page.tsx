"use client";
import Link from "next/link";
import { Navbar } from "@/app/_components/navbar";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/stores/onboarding";

export default function OnboardingIndex() {
    const role = useOnboardingStore((s) => s.role);
    const setRole = useOnboardingStore((s) => s.setRole);

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <Navbar />

                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-10">
                    <h1 className="mb-6 text-center font-poppins text-2xl font-semibold text-neutral-900 sm:text-3xl">
                        Sign Up As A
                    </h1>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {(() => {
                            const isStudent = role === "student";
                            return (
                                <button
                                    aria-pressed={isStudent}
                                    className={`rounded-2xl p-6 text-center transition-all duration-200 md:p-8
                                        border ${isStudent ? "border-[#1E88FF]" : "border-neutral-200"}
                                        ${isStudent ? "bg-blue-50" : "bg-white"}
                                        ${isStudent ? "shadow-lg" : "shadow-sm"}
                                        hover:shadow-lg hover:border-[#1E88FF] hover:bg-blue-50`}
                                    onClick={() => setRole("student")}
                                >
                                    <div className="mx-auto mb-3 h-16 w-16 rounded-full border border-neutral-300 bg-blue-100" />
                                    <div className="text-lg font-semibold">Student</div>
                                </button>
                            );
                        })()}

                        {(() => {
                            const isTutor = role === "tutor";
                            return (
                                <button
                                    aria-pressed={isTutor}
                                    className={`rounded-2xl p-6 text-center transition-all duration-200 md:p-8
                                        border ${isTutor ? "border-[#1E88FF]" : "border-neutral-200"}
                                        ${isTutor ? "bg-blue-50" : "bg-white"}
                                        ${isTutor ? "shadow-lg" : "shadow-sm"}
                                        hover:shadow-lg hover:border-[#1E88FF] hover:bg-blue-50`}
                                    onClick={() => setRole("tutor")}
                                >
                                    <div className="mx-auto mb-3 h-16 w-16 rounded-full border border-neutral-300 bg-blue-100" />
                                    <div className="text-lg font-semibold">Tutor</div>
                                </button>
                            );
                        })()}
                    </div>

                    <div className="mt-8 text-center">
                        {role === "student" && (
                            <Button asChild variant="brand" className="rounded-full px-8 py-6 text-black">
                                <Link href="/onboarding/student/goals">Next</Link>
                            </Button>
                        )}
                        {role === "tutor" && (
                            <Button asChild variant="brand" className="rounded-full px-8 py-6 text-black">
                                <Link href="/onboarding/tutor/subjects">Next</Link>
                            </Button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
