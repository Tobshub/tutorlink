"use client";
import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/app/_components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/stores/onboarding";

export default function TutorExperience() {
    const yearsOfExperience = useOnboardingStore((s) => s.yearsOfExperience);
    const setYearsOfExperience = useOnboardingStore((s) => s.setYearsOfExperience);
    const [inputValue, setInputValue] = useState(yearsOfExperience?.toString() ?? "");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers
        if (value === "" || /^\d+$/.test(value)) {
            setInputValue(value);
            const numValue = parseInt(value);
            if (!isNaN(numValue)) {
                setYearsOfExperience(numValue);
            } else if (value === "") {
                setYearsOfExperience(null);
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <Navbar />

                <main className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <h2 className="mb-2 font-poppins text-2xl font-semibold text-neutral-800">Years of Experience</h2>
                    <div className="mb-6 h-px w-full bg-neutral-300"></div>
                    <p className="mb-6 text-neutral-600">
                        How many years of teaching experience do you have? This helps students understand your expertise level.
                    </p>

                    <div className="mb-8">
                        <Input
                            type="text"
                            placeholder="Enter number of years"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="text-center text-lg"
                        />
                        <p className="mt-2 text-sm text-neutral-500">
                            Enter only numbers (e.g., 5, 10, 15)
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <Button
                            asChild
                            variant="brand"
                            className="rounded-full px-8 py-6 text-black"
                            disabled={!yearsOfExperience || yearsOfExperience <= 0}
                        >
                            <Link href="/onboarding/tutor/teaching-style">Next</Link>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
