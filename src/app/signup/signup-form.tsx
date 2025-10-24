"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import z from "zod";
import { authSignUpWithEmail, authLoginWithGoogle } from "@/lib/auth-client";

const signupSchema = z.object({
    username: z.string().min(2).max(50).optional(),
    email: z.string().email(),
    password: z.string().min(8).max(100),
});

export type SignupInfo = z.infer<typeof signupSchema>;

export type SignupFormProps = {
    onEmailPasswordSubmit?: (payload: SignupInfo) => Promise<void> | void;
    onGoogle?: () => Promise<void> | void;
};

function LogoMark(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 48 48" aria-hidden className="h-10 w-10" {...props}>
            <path d="M21 28a5 5 0 0 0 7 0l5-5a5 5 0 1 0-7-7l-2.5 2.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M27 20a5 5 0 0 0-7 0l-5 5a5 5 0 1 0 7 7L24.5 29" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

export function SignupForm({ onEmailPasswordSubmit, onGoogle }: SignupFormProps) {
    const [pending, setPending] = React.useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = String(formData.get("username") ?? "").trim() || undefined;
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        const parsed = signupSchema.safeParse({ username, email, password });
        if (!parsed.success) {
            console.error("[signup] validation failed", parsed.error);
            return;
        }

        try {
            setPending(true);
            if (onEmailPasswordSubmit) {
                await onEmailPasswordSubmit(parsed.data);
            } else {
                await authSignUpWithEmail(parsed.data);
            }
            router.replace("/");
        } catch (err) {
            console.error("[signup] error", err);
        } finally {
            setPending(false);
        }
    }

    const handleGoogle = async () => {
        try {
            if (onGoogle) await onGoogle();
            else await authLoginWithGoogle({ redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined });
        } catch (err) {
            console.error("[signup] google error", err);
        }
    };

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

            <form className="mt-6 space-y-4" method="post" onSubmit={handleSubmit}>
                <Input type="text" name="username" placeholder="Username" autoComplete="username" disabled={pending} />
                <Input type="email" name="email" placeholder="Email" autoComplete="email" required disabled={pending} />
                <Input type="password" name="password" placeholder="Password" autoComplete="new-password" required disabled={pending} />

                <Button type="submit" variant="brand" size="lg" className="mt-2 w-full rounded-full shadow-md text-black" disabled={pending}>
                    Create account
                </Button>

                <div className="relative py-2 text-center text-sm text-neutral-500">
                    <span className="bg-white/70 px-2">or</span>
                    <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-neutral-200" />
                </div>

                <Button asChild variant="brandOutline" size="lg" className="w-full rounded-full" disabled={pending}>
                    <Link href="#" aria-label="Continue with Google" onClick={(e) => { e.preventDefault(); void handleGoogle(); }}>
                        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center">
                            {/* Google G icon */}
                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                                <path d="M21.35 11.1H12v2.8h5.3c-.23 1.48-1.66 4.34-5.3 4.34a5.8 5.8 0 1 1 0-11.6 5.1 5.1 0 0 1 3.6 1.4l1.9-1.9A8.31 8.31 0 0 0 12 3.5 8.5 8.5 0 1 0 20.5 12c0-.6-.05-1-.15-1.4Z" fill="#4285F4" />
                            </svg>
                        </span>
                        Continue with Google
                    </Link>
                </Button>

                <p className="text-center text-sm text-neutral-700">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-[#1E88FF] underline-offset-4 hover:underline">Log in</Link>
                </p>
            </form>
        </>
    );
}
