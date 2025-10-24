import * as React from "react";
import { Navbar } from "@/app/_components/navbar";
import { LoginForm } from "./login-form";

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <Navbar />

                <main className="mx-auto mt-10 max-w-md rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:mt-14 sm:p-8">
                    <LoginForm />
                </main>
            </div>
        </div>
    );
}
