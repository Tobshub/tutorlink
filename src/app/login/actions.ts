"use server";

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function loginWithEmail(payload: { email: string; password: string }) {
  const supabase = await createSupabaseServerClient()

  const data = {
    email: payload.email,
    password: payload.password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function signup(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: { user } } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function loginWithGoogle() {
  // Example:
  // return await authClient.signInWithOAuth({ provider: 'google', options: { redirectTo: '/dashboard' } })
}
