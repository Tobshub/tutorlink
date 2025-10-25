"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/stores/onboarding";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export default function StudentSummary() {
    const router = useRouter();
    const {
        role,
        hydrated,
        goals,
        style,
        preferredTutorGender,
        subjectInterests,
        reset,
    } = useOnboardingStore();

    const { mutate: createProfile, isPending } = api.student.createProfile.useMutation({
        onSuccess: () => {
            toast.success("Profile created successfully!");
            reset();
            router.push("/dashboard");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if (!hydrated) return;
        if (role !== "student") router.replace("/onboarding");
    }, [hydrated, role, router]);

    const handleFinish = () => {
        createProfile({
            goals: Array.from(goals),
            learningStyle: Array.from(style),
            preferredTutorGender: preferredTutorGender ?? undefined,
            subjectsOfInterest: Array.from(subjectInterests),
        });
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <h2 className="mb-6 font-poppins text-2xl font-semibold text-neutral-800">Summary</h2>

                    <div className="space-y-4 text-neutral-800">
                        <div>
                            <div className="text-sm text-neutral-500">Role</div>
                            <div className="font-medium">{role ?? "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Goals</div>
                            <div className="font-medium">{goals.size > 0 ? Array.from(goals).join(", ") : "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Learning Style</div>
                            <div className="font-medium">{style.size > 0 ? Array.from(style).join(", ") : "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Subjects of Interest</div>
                            <div className="font-medium">{subjectInterests.size > 0 ? Array.from(subjectInterests).join(", ") : "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Preferred Tutor Gender</div>
                            <div className="font-medium">{preferredTutorGender ?? "—"}</div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Button asChild variant="brandOutline" className="rounded-full px-6">
                            <Link href="/onboarding/student/subjects">Back</Link>
                        </Button>
                        <Button
                            variant="brand"
                            className="rounded-full px-8 py-6 text-black"
                            onClick={handleFinish}
                            disabled={isPending}
                        >
                            {isPending ? "Finishing..." : "Finish"}
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
