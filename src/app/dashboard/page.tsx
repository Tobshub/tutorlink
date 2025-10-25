import "server-only";
import { api } from "@/trpc/server";
import { TutorCard } from "./_components/tutor-card";

//TODO: Add loading states + suspense boundaries for better UX

export default async function DashboardHome() {
    // TODO: Update this - A generic name was used here because auth was avoided
    const name = "there";

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-1">
                <h1 className="font-poppins text-2xl font-semibold text-neutral-900">Welcome back{name ? ` ${name}` : ""}!</h1>
                <p className="text-neutral-600">Jump back into learning</p>
            </header>

            <section>
                <h2 className="mb-3 text-xl font-semibold text-neutral-900">Recent Tutors</h2>
                {/** fetch recent tutors server-side via tRPC RSC */}
                {await (async () => {
                    const tutors = await api.tutor.listRecent({ limit: 6 });
                    if (!tutors.length) return <div className="text-sm text-neutral-500">No tutors yet.</div>;
                    return (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {tutors.map((t: typeof tutors[0]) => (
                                <TutorCard
                                    key={t.id}
                                    name="Tutor"
                                    subjects={t.subjectInterests}
                                    yearsOfExperience={t.yearsOfExperience}
                                />
                            ))}
                        </div>
                    );
                })()}
            </section>
        </div>
    );
}
