import "server-only";
import type { ReactNode } from "react";
import { Sidebar } from "./_components/sidebar";
import { DashboardClientLayout } from './_components/dashboard-client-layout';

// The Clerk middleware handles auth protection, so this layout is only reached by authenticated users
export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#F3F8FF]">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
                    {/* Sidebar (client) */}
                    <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
                        <Sidebar />
                    </aside>
                    {/* Main content */}
                    <main className="min-h-[70vh] rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6 lg:p-8">
                        <DashboardClientLayout>{children}</DashboardClientLayout>
                    </main>
                </div>
            </div>
        </div>
    );
}