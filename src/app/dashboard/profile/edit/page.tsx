import "server-only";
import { api } from "@/trpc/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EditProfilePage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch existing profiles (either student or tutor) for prefill (future work)
    const [student, tutor] = await Promise.all([
        api.student.getProfile(),
        api.tutor.getProfile(),
    ]);

    return (
        <div className="space-y-2">
            <h1 className="text-xl font-semibold text-neutral-900">Edit profile</h1>
            <p className="text-sm text-neutral-600">Prefill coming from your current {tutor ? 'tutor' : student ? 'student' : '—'} profile.</p>
            {/* TODO: add client form to update via tRPC */}
        </div>
    );
}
