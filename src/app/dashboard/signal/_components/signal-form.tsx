"use client";

import { useState } from "react";
import { AlertCircle, Send, Zap } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Economics",
    "Computer Science",
    "Literature",
];

type UrgencyLevel = {
    level: number;
    label: string;
    color: string;
};

const urgencyLevels: UrgencyLevel[] = [
    { level: 1, label: "Low", color: "bg-blue-100 border-blue-300 text-blue-900" },
    { level: 2, label: "Moderate", color: "bg-yellow-100 border-yellow-300 text-yellow-900" },
    { level: 3, label: "High", color: "bg-orange-100 border-orange-300 text-orange-900" },
    { level: 4, label: "Very High", color: "bg-red-100 border-red-300 text-red-900" },
    { level: 5, label: "Critical", color: "bg-red-200 border-red-400 text-red-950 font-bold" },
];

export function SignalForm() {
    const [selectedSubject, setSelectedSubject] = useState("");
    const [message, setMessage] = useState("");
    const [urgency, setUrgency] = useState(3);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createSignalMutation = api.signal.createSignal.useMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubject || !message.trim()) return;

        setIsSubmitting(true);

        try {
            await createSignalMutation.mutateAsync({
                message,
                subject: selectedSubject,
                urgency,
                status: "pending",
            });

            toast.success("Signal sent! Tutors are being notified...");
            setSelectedSubject("");
            setMessage("");
            setUrgency(3);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create signal. Please try again.";
            toast.error(errorMessage);
            console.error("Error creating signal:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject Selection */}
                <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-3">
                        What subject do you need help with?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {subjects.map((subject) => (
                            <button
                                key={subject}
                                type="button"
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${selectedSubject === subject
                                    ? "bg-indigo-600 text-white shadow-lg scale-105"
                                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Problem/Question */}
                <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        What&apos;s your problem or question?
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g., I need help solving question 5 WAEC past paper on projectile motion"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none placeholder-neutral-400 text-neutral-900"
                        rows={4}
                        maxLength={500}
                    />
                    <p className="mt-2 text-xs text-neutral-500">
                        {message.length}/500 characters
                    </p>
                </div>

                {/* Urgency Level */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={18} className="text-indigo-600" />
                        <label className="block text-sm font-semibold text-neutral-900">
                            How urgent is your request?
                        </label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {urgencyLevels.map(({ level, label, color }) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setUrgency(level)}
                                className={`px-3 py-2 rounded-lg font-medium text-sm border-2 transition-all duration-200 ${urgency === level
                                    ? `${color} shadow-lg scale-105 border-current`
                                    : `${color} border-transparent opacity-60 hover:opacity-100`
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Alert Box */}
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded flex gap-3">
                    <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-900">
                            💬 Your signal will be broadcast to nearby tutors
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                            Average response time: 2-5 minutes. Higher urgency gets priority.
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!selectedSubject || !message.trim() || isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${isSubmitting
                        ? "bg-indigo-400 text-white cursor-not-allowed"
                        : selectedSubject && message.trim()
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                            : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending Signal...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Send Signal Now
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
