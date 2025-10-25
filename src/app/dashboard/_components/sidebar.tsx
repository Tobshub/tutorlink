"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, BookOpen, MessageSquare, Phone, Settings } from "lucide-react";
import { useState } from "react";

type Item = {
    href: string;
    label: string;
    icon: React.ReactNode;
};

const items: Item[] = [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/dashboard/signal", label: "Signal", icon: <Activity size={18} /> },
    { href: "/dashboard/lessons", label: "Lessons", icon: <BookOpen size={18} /> },
    { href: "/dashboard/messages", label: "Messages", icon: <MessageSquare size={18} /> },
    { href: "/dashboard/calls", label: "Live Sessions", icon: <Phone size={18} /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
];

export function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const Nav = (
        <nav className="rounded-2xl bg-white/90 p-3 shadow-sm backdrop-blur">
            <div className="px-3 py-4 text-lg font-semibold text-neutral-900">TutorLink</div>
            <ul className="space-y-1">
                {items.map((i) => {
                    const active = pathname === i.href;
                    return (
                        <li key={i.href}>
                            <Link
                                href={i.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors
                  ${active ? "bg-blue-100 text-neutral-900" : "text-neutral-700 hover:bg-neutral-100"}`}
                                onClick={() => setOpen(false)}
                            >
                                <span className="text-[#1E88FF]">{i.icon}</span>
                                <span>{i.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );

    return (
        <>
            {/* Mobile topbar */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm"
                >
                    {open ? "Close" : "Menu"}
                </button>
                <div className="text-base font-semibold">TutorLink</div>
            </div>
            <div className={`lg:block ${open ? "block" : "hidden"}`}>{Nav}</div>
        </>
    );
}
