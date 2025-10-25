"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { TutorCard } from "./tutor-card";
import { Search } from "lucide-react";

interface TutorWithUser {
    id: string;
    user: { id: string; name: string | null; email: string | null };
    subjectInterests: string[];
    yearsOfExperience: number;
}

export function TutorSearch() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<TutorWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { refetch } = api.tutor.searchByUsername.useQuery(
        { query: query.trim() },
        { enabled: false }
    );

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsLoading(true);
            const res = await refetch();
            setResults((res.data as TutorWithUser[]) ?? []);
            setIsOpen(true);
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search tutors by name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 pl-10 text-sm text-neutral-900 placeholder-neutral-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                </div>
            </form>

            {/* Search Results Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20">
                    <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg">
                        {/* Header */}
                        <div className="border-b border-neutral-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-neutral-900">
                                    Search Results
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setResults([]);
                                    }}
                                    className="text-neutral-400 hover:text-neutral-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-96 overflow-y-auto p-6">
                            {isLoading ? (
                                <div className="text-center text-neutral-500">Searching...</div>
                            ) : results.length === 0 ? (
                                <div className="text-center text-neutral-500">
                                    No tutors found matching &quot;{query}&quot;
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {results.map((tutor) => (
                                        <TutorCard
                                            key={tutor.id}
                                            name={tutor.user?.name ?? "Tutor"}
                                            subjects={tutor.subjectInterests}
                                            yearsOfExperience={tutor.yearsOfExperience}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
