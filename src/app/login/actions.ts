"use server";

// Typed server action placeholders for future wiring.
// TODO(auth): Implement these with your auth provider (NextAuth, Supabase Auth, custom, etc.).
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/client';

export async function loginWithEmail(payload: {email: string; password: string}) {
  const supabase = createClient()

  const data = {
    email: payload.email,
    password: payload.password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: {user} } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function loginWithGoogle() {
    // Example:
    // return await authClient.signInWithOAuth({ provider: 'google', options: { redirectTo: '/dashboard' } })
}
