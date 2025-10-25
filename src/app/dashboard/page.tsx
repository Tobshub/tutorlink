import "server-only";
import { TutorSearch } from "./_components/tutor-search";
import { RecommendedTutors } from './_components/recommended-tutors';

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

            {/* Tutor Search */}
            <section>
                <TutorSearch />
            </section>

            <section>
                <RecommendedTutors />
            </section>
        </div>
    );
}
