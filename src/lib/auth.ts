import { supabase } from './supabaseClient';

// Sign up with email/passwordexport async function signUpWithEmail(email: string, password: string) {
  return await supabase.auth.signUp({ email, password });
}

// Sign in with email/password
export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

// Sign in with Google
export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({ provider: 'google' });
}

// Sign out
export async function signOut() {
  return await supabase.auth.signOut();
}

// Get current user
export function getCurrentUser() {
  return supabase.auth.getUser();
}
