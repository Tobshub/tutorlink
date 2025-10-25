"use client";

import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { api } from "@/trpc/react";
import { Zap } from "lucide-react";

export default function SettingsPage() {
    const { data: role, isLoading, isError } = api.signal.getViewerRole.useQuery();
    const isTutor = !!role && role === "TUTOR";

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl font-semibold text-neutral-900">Settings</h1>

            {/* Loading state */}
            {isLoading && (
                <div className="pt-4 border-t border-neutral-200">
                    <div className="h-10 bg-neutral-200 rounded-lg animate-pulse"></div>
                </div>
            )}

            {/* Error state */}
            {isError && (
                <div className="pt-4 border-t border-neutral-200">
                    <p className="text-sm text-red-600">Failed to load user role</p>
                </div>
            )}

            {/* Tutor-specific section - only show when loaded and is tutor */}
            {!isLoading && !isError && isTutor && (
                <div className="pt-4 border-t border-neutral-200">
                    <h2 className="text-lg font-medium text-neutral-900 mb-4">Signals</h2>
                    <Link href="/dashboard/signal">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                            <Zap size={18} />
                            View Active Signals
                        </button>
                    </Link>
                </div>
            )}

            <div className="pt-4 border-t border-neutral-200">
                <h2 className="text-lg font-medium text-neutral-900 mb-4">Account</h2>
                <SignOutButton redirectUrl="/">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Sign Out
                    </button>
                </SignOutButton>
            </div>
        </div>
    );
}