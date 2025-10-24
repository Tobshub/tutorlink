import { createClient } from "@/lib/supabase/client";

export async function authLoginWithEmail({ email, password }: { email: string; password: string }) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function authLoginWithGoogle(opts?: { redirectTo?: string }) {
    const supabase = createClient();
    const redirectTo = opts?.redirectTo ?? (typeof window !== "undefined" ? `${window.location.origin}/onboarding` : undefined);
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) throw error;
    return data;
}

export async function authSignUpWithEmail({ email, password, username }: { email: string; password: string; username?: string }) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: username ? { data: { username } } : undefined,
    });
    if (error) throw error;
    return data;
}
