"use server";

import { redirect } from 'next/navigation'

export async function loginWithEmail(_payload: { email: string; password: string }) {
  // With Clerk, authentication is handled by the /sign-in route
  // Redirect users to the Clerk sign-in page
  redirect('/sign-in')
}

export async function signup(_formData: FormData) {
  // With Clerk, authentication is handled by the /sign-up route
  // Redirect users to the Clerk sign-up page
  redirect('/sign-up')
}

export async function loginWithGoogle() {
  // Google OAuth is handled by Clerk's sign-in/sign-up pages
  // No manual setup needed
  redirect('/sign-in')
}
