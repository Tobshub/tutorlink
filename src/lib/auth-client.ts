import { createClient } from "@/lib/supabase/client";

export async function authLoginWithEmail({ email, password }: { email: string; password: string }) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function authLoginWithGoogle(opts?: { redirectTo?: string }) {
    const supabase = createClient();
    // Validate redirectTo to prevent open redirects: allow relative paths or same-origin URLs only
    let redirectTo: string | undefined = undefined;
    if (typeof window !== "undefined") {
        const fallback = `${window.location.origin}/onboarding`;
        const requested = opts?.redirectTo;
        if (requested) {
            if (requested.startsWith("/")) {
                redirectTo = new URL(requested, window.location.origin).toString();
            } else {
                try {
                    const url = new URL(requested, window.location.origin);
                    if (url.origin === window.location.origin) {
                        redirectTo = url.toString();
                    } else {
                        redirectTo = fallback;
                    }
                } catch {
                    redirectTo = fallback;
                }
            }
        } else {
            redirectTo = fallback;
        }
    }
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
