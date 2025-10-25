"use client";

import { SignalForm } from "./_components/signal-form";
import { Activity, Clock, Zap } from "lucide-react";
import { useState } from "react";

// Mock active signals for demo
type Signal = {
    id: string;
    studentName: string;
    subject: string;
    message: string;
    urgency: 1 | 2 | 3 | 4 | 5;
    timeAgo: string;
    acceptedBy: string | null;
};

const mockActiveSignals: Signal[] = [
    {
        id: "1",
        studentName: "Alex Johnson",
        subject: "Physics",
        message: "Help with quantum mechanics problem set",
        urgency: 4,
        timeAgo: "2 min",
        acceptedBy: null,
    },
    {
        id: "2",
        studentName: "Sarah Williams",
        subject: "Mathematics",
        message: "I need help solving complex integration problems",
        urgency: 3,
        timeAgo: "5 min",
        acceptedBy: null,
    },
    {
        id: "3",
        studentName: "Mike Chen",
        subject: "Chemistry",
        message: "WAEC past paper - organic chemistry reactions",
        urgency: 5,
        timeAgo: "1 min",
        acceptedBy: null,
    },
];

const urgencyConfig = {
    1: { label: "Low", bg: "bg-blue-100", text: "text-blue-900", badge: "border-blue-300" },
    2: { label: "Moderate", bg: "bg-yellow-100", text: "text-yellow-900", badge: "border-yellow-300" },
    3: { label: "High", bg: "bg-orange-100", text: "text-orange-900", badge: "border-orange-300" },
    4: { label: "Very High", bg: "bg-red-100", text: "text-red-900", badge: "border-red-300" },
    5: { label: "Critical", bg: "bg-red-200", text: "text-red-950", badge: "border-red-400" },
};

function SignalCard({ signal }: { signal: (typeof mockActiveSignals)[0] }) {
    const config = urgencyConfig[signal.urgency];

    return (
        <div className="p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-white">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        {signal.studentName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 text-sm">{signal.studentName}</p>
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                            <Clock size={12} />
                            {signal.timeAgo} ago
                        </p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold ${config.badge} border-2 ${config.bg} ${config.text}`}>
                    {config.label}
                </div>
            </div>

            <div className="mb-3">
                <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-900 text-xs font-semibold rounded-full mb-2">
                    {signal.subject}
                </span>
                <p className="text-sm text-neutral-700 line-clamp-2">{signal.message}</p>
            </div>

            <button className="w-full mt-3 px-3 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 active:scale-95">
                Accept Signal
            </button>
        </div>
    );
}

export default function SignalPage() {
    const [tabActive, setTabActive] = useState<"create" | "active">("create");

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Zap size={24} className="text-indigo-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Signal</h1>
                </div>
                <p className="text-neutral-600 text-sm sm:text-base">
                    Get instant help from nearby tutors by broadcasting your signal
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-neutral-200">
                <button
                    onClick={() => setTabActive("create")}
                    className={`px-4 py-3 font-semibold text-sm sm:text-base border-b-2 transition-colors duration-200 ${tabActive === "create"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-neutral-600 hover:text-neutral-900"
                        }`}
                >
                    Create Signal
                </button>
                <button
                    onClick={() => setTabActive("active")}
                    className={`px-4 py-3 font-semibold text-sm sm:text-base border-b-2 transition-colors duration-200 flex items-center gap-2 ${tabActive === "active"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-neutral-600 hover:text-neutral-900"
                        }`}
                >
                    <Activity size={18} />
                    Active Signals
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        {mockActiveSignals.length}
                    </span>
                </button>
            </div>

            {/* Tab Content */}
            <div className="mb-12">
                {tabActive === "create" ? (
                    <div className="space-y-8">
                        <div className="p-6 bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg">
                            <h2 className="text-xl font-bold text-neutral-900 mb-2">
                                🚀 Need help fast?
                            </h2>
                            <p className="text-neutral-700">
                                Send a signal and connect with available tutors in seconds. The more urgent your request, the faster you&apos;ll get matched.
                            </p>
                        </div>
                        <SignalForm />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {mockActiveSignals.length > 0 ? (
                            <>
                                <p className="text-sm text-neutral-600 mb-4">
                                    Showing {mockActiveSignals.length} active signals from students
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {mockActiveSignals.map((signal) => (
                                        <SignalCard key={signal.id} signal={signal} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Activity size={48} className="mx-auto text-neutral-300 mb-4" />
                                <p className="text-neutral-600 text-lg">No active signals right now</p>
                                <p className="text-neutral-500 text-sm">Check back soon!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tips Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-t border-neutral-200">
                <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                        <span className="text-xl">⚡</span> Pro Tips
                    </h3>
                    <ul className="text-sm text-neutral-600 space-y-1">
                        <li>• Be specific about your question</li>
                        <li>• Set the correct urgency level</li>
                        <li>• Respond quickly when tutors accept</li>
                    </ul>
                </div>
                <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                        <span className="text-xl">📊</span> Current Stats
                    </h3>
                    <ul className="text-sm text-neutral-600 space-y-1">
                        <li>• Avg response time: 2-5 minutes</li>
                        <li>• 150+ active tutors online</li>
                        <li>• 98% satisfaction rate</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
