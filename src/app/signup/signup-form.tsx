import * as React from "react";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

function LogoMark(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 48 48" aria-hidden className="h-10 w-10" {...props}>
            <path d="M21 28a5 5 0 0 0 7 0l5-5a5 5 0 1 0-7-7l-2.5 2.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M27 20a5 5 0 0 0-7 0l-5 5a5 5 0 1 0 7 7L24.5 29" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

export function SignupForm() {
    return (
        <>
            <div className="flex flex-col items-center text-center">
                <div className="mb-2 text-[#1E88FF]">
                    <LogoMark />
                </div>
                <h1 className="font-poppins text-3xl font-semibold text-neutral-900 sm:text-4xl">
                    Sign<span className="text-[#1E88FF]">Up</span>
                </h1>
            </div>

            <div className="mt-6 space-y-4">
                <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                    <button className="w-full rounded-full bg-[#1E88FF] px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#1565C0]">
                        Sign up
                    </button>
                </SignUpButton>

                <p className="text-center text-sm text-neutral-700">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-[#1E88FF] underline-offset-4 hover:underline">Log in</Link>
                </p>
            </div>
        </>
    );
}
